import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/env';

declare global {
  interface Window {
    Square: any;
  }
}

@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.component.html',
  styleUrls: ['./card-payment.component.css'],
})
export class CardPaymentComponent implements OnInit {
 

  private payments: any;
  private card: any;
  public totalAmount: number = 15.99; // Initial total
  private baseUrl = environment.baseUrl;
  private locationId = environment.locationId;
  private applicationId = environment.applicationId;


  async ngOnInit(): Promise<void> {
    await this.initializeSquare();

    // Ensure total price is updated on quantity change
    const quantityInputs = document.querySelectorAll('.quantity-input') as NodeListOf<HTMLInputElement>;
    quantityInputs.forEach(input => {
      input.addEventListener('input', () => this.updateTotalPrice());
    });
    
    // Handle click event on Proceed to Payment button
    const proceedToPaymentButton = document.getElementById('proceed-to-payment-button');
    if (proceedToPaymentButton) {
      proceedToPaymentButton.addEventListener('click', () => {
        const paymentFormContainer = document.getElementById('payment-form-container');
        if (paymentFormContainer) {
          // Show the payment form when the button is clicked
          paymentFormContainer.style.display = 'block';
        }
      });
    }
  }



  private initializeSquare(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.payments = window.Square.payments(this.applicationId, this.locationId);
        this.card = await this.initializeCard(this.payments);
        resolve();
      } catch (e) {
        console.error('Initializing Square Payments failed', e);
        reject(e);
      }
    }).then(() => {
      const paymentButton = document.getElementById('payment-button');
      if (paymentButton) {
        paymentButton.addEventListener('click', async () => {
          const firstName = (document.getElementById('firstName') as HTMLInputElement).value;
          const lastName = (document.getElementById('lastName') as HTMLInputElement).value;
          const email = (document.getElementById('email') as HTMLInputElement).value;

          // Tokenize card details
          const cardResult = await this.card.tokenize();
          if (cardResult.status === 'OK') {
            const requestBody = {
              token: cardResult.token,
              firstName: firstName,
              lastName: lastName,
              email: email,
              amount: 5000  // Example amount in cents ($50.00)
            };

            // Send tokenized card data and customer info to the backend
            fetch(`${this.baseUrl}payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestBody)
            })
            .then(response => response.json())
            .then(data => {
              alert('Payment Successful');
            })
            .catch(error => {
              console.error('Payment failed:', error);
            });
          } else {
            console.error('Tokenization failed:', cardResult.errors);
          }
        });
      }
    });
  }

  private async initializeCard(payments: any): Promise<any> {
    const card = await payments.card();
    await card.attach('#card-container');
    return card;
  }

  private updateTotalPrice() {
    const quantityInputs = document.querySelectorAll('.quantity-input') as NodeListOf<HTMLInputElement>;
    let totalPrice = 0;

    quantityInputs.forEach(input => {
      const price = parseFloat(input.getAttribute('data-price') || '0');
      const quantity = parseInt(input.value, 10);
      totalPrice += price * quantity;
    });

    this.totalAmount = totalPrice;
    document.getElementById('total-price')!.innerText = totalPrice.toFixed(2);
  }

  private async tokenize(paymentMethod: any): Promise<string> {
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

  private async verifyBuyer(payments: any, token: string): Promise<string> {
    const verificationDetails = {
      amount: '1.00',
      billingContact: {
        givenName: 'John',
        familyName: 'Doe',
        email: 'john.doe@square.example',
        phone: '3214563987',
        addressLines: ['123 Main Street', 'Apartment 1'],
        city: 'London',
        state: 'LND',
        countryCode: 'GB',
      },
      currencyCode: 'GBP',
      intent: 'CHARGE',
    };

    const verificationResults = await payments.verifyBuyer(token, verificationDetails);
    return verificationResults.token;
  }

  private displayPaymentResults(status: string): void {
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

  private async handlePaymentMethodSubmission(event: Event, card: any): Promise<void> {
    event.preventDefault();
    const cardButton = event.target as HTMLButtonElement;
    try {
      cardButton.disabled = true;
      const token = await this.tokenize(card);
      const verificationToken = await this.verifyBuyer(this.payments, token);
      // Send token and verificationToken to your server to process the payment
      this.displayPaymentResults('SUCCESS');
    } catch (e) {
      cardButton.disabled = false;
      this.displayPaymentResults('FAILURE');
      console.error(e);
    }
  }
}
