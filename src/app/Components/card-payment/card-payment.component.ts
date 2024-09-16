import { Component, OnInit } from '@angular/core';
declare global {
  interface Window {
    Square: any;
  }
}
@Component({
  selector: 'app-card-payment',
  standalone: true,
  imports: [],
  templateUrl: './card-payment.component.html',
  styleUrl: './card-payment.component.css'
})
export class CardPaymentComponent implements OnInit{
  private appId = 'sandbox-sq0idb-ucpDX7q3yDlQeR4mNtJ_Jw'; // Sandbox App ID
  private locationId = 'L5RQX9N79RTZK'; // Sandbox Location ID
  private card: any;
  private payments: any;
  public serviceName: string = '';
  public servicePrice: string = '';
  public totalAmount: number = 8.00; // Initial total

  async ngOnInit() {
    await this.initializeSquare();

    const proceedToPaymentButton = document.getElementById('proceed-to-payment-button');
    const quantityInputs = document.querySelectorAll('.quantity-input') as NodeListOf<HTMLInputElement>;
   
     // Listen for changes in the quantity input fields
     quantityInputs.forEach(input => {
      input.addEventListener('input', () => this.updateTotalPrice());
    });

    if (proceedToPaymentButton) {
      proceedToPaymentButton.addEventListener('click', () => {
        // Show the payment form
        document.getElementById('payment-form-container')!.style.display = 'block';
      });
    }
  }

  private updateTotalPrice() {
    const quantityInputs = document.querySelectorAll('.quantity-input') as NodeListOf<HTMLInputElement>;
    let totalPrice = 0;

    // Calculate the total price based on selected services and their quantities
    quantityInputs.forEach(input => {
      const price = parseFloat(input.getAttribute('data-price') || '0');
      const quantity = parseInt(input.value, 10);
      totalPrice += price * quantity;
    });

    this.totalAmount = totalPrice;
    document.getElementById('total-price')!.innerText = totalPrice.toFixed(2);
  }
  
  private async initializeSquare() {
    if (!window.Square) {
      throw new Error('Square.js failed to load properly');
    }

    try {
      this.payments = window.Square.payments(this.appId, this.locationId);
      this.card = await this.initializeCard(this.payments);
    } catch (e) {
      console.error('Initializing Square Payments failed', e);
      return;
    }

    const cardButton = document.getElementById('card-button');
    if (cardButton) {
      cardButton.addEventListener('click', (event) => this.handlePaymentMethodSubmission(event, this.card));
    }
  }

  private async initializeCard(payments: any) {
    const card = await payments.card();
    await card.attach('#card-container');
    return card;
  }

  private async tokenize(paymentMethod: any) {
    const tokenResult = await paymentMethod.tokenize();
    if (tokenResult.status === 'OK') {
      return tokenResult.token;
    } else {
      let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
      if (tokenResult.errors) {
        errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
      }
      throw new Error(errorMessage);
    }
  }

  private async verifyBuyer(payments: any, token: string) {
    const verificationDetails = {
      amount: this.servicePrice,
      billingContact: {
        givenName: 'John',
        familyName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        addressLines: ['123 Main Street'],
        city: 'Some City',
        state: 'ST',
        countryCode: 'US',
      },
      currencyCode: 'USD',
      intent: 'CHARGE',
    };

    const verificationResults = await payments.verifyBuyer(token, verificationDetails);
    return verificationResults.token;
  }

  private displayPaymentResults(status: any) {
    const statusContainer = document.getElementById('payment-status-container');
    if (statusContainer) {
      if (status === 'SUCCESS') {
        statusContainer.classList.remove('is-failure');
        statusContainer.classList.add('is-success');
      } else {
        statusContainer.classList.remove('is-success');
        statusContainer.classList.add('is-failure');
      }
      statusContainer.style.visibility = 'visible';
    }
  }

  private async handlePaymentMethodSubmission(event: Event, card: any) {
    event.preventDefault();
    const cardButton = event.target as HTMLButtonElement;

    try {
      cardButton.disabled = true;
      const token = await this.tokenize(card);
      const verificationToken = await this.verifyBuyer(this.payments, token);
      const paymentResults = await this.createPayment(token, verificationToken);
      this.displayPaymentResults('SUCCESS');
      console.debug('Payment Success', paymentResults);
    } catch (e) {
      cardButton.disabled = false;
      this.displayPaymentResults('FAILURE');
      console.error(e);
    }
  }

  private async createPayment(token: string, verificationToken: string) {
    // Here you would send the token and verification token to your backend server
    // to process the payment.
    console.log('Payment created with token:', token);
  }

  // Method to get the selected service from the form
  private getSelectedService(): { name: string, price: string } | null {
    const form = document.getElementById('service-selection-form') as HTMLFormElement;
    const checkedRadio = form.querySelector('input[type="radio"]:checked');
    
    if (checkedRadio) {
      return {
        name: checkedRadio.getAttribute('data-name') || '',
        price: checkedRadio.getAttribute('value') || '0.00'
      };
    }
    return null;
  }
}
