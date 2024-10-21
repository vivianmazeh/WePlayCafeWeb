import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/env';
var cors = require('cors');

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
  public totalAmount: number = 0; // Initial total
  private locationId = environment.locationId;
  private baseUrl = environment.baseUrl;
  private appId = environment.applicationId;
  private statusContainer: any;


  async ngOnInit(): Promise<void> {
    try {
      await this.initializeSquare();
    } catch (e) {
      console.error('Error during Square initialization', e);
    }

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

  private async initializeSquare() : Promise<void>{
    if (!window.Square) {
      throw new Error('Square.js failed to load properly');
    }

    
    try {
      this.payments = window.Square.payments(this.appId, this.locationId);
    } catch(e) {
      console.error('Initializing Square Payments failed', e);
      this.statusContainer = document.getElementById(
        'payment-status-container',
      );

      if(this.statusContainer){
        this.statusContainer.className = 'missing-credentials';
        this.statusContainer.style.visibility = 'visible';
      }    
      throw e; 
    }

      try {
        this.card = await this.initializeCard(this.payments);
      } catch (e) {
        console.error('Initializing Card failed', e);
        return;
      }
  
  const cardButton = document.getElementById('card-button');
  if (cardButton) {
    cardButton.addEventListener('click', async (event) => {
      await this.handlePaymentMethodSubmission(event, this.card);
    });
  }
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

  private async initializeCard(payments: any): Promise<any> {
    this.card = await payments.card();
    await this.card.attach('#card-container');
    return this.card;
  }

  private async createPayment(token: string): Promise<any> {
 
    const body = JSON.stringify({
      sourceId: token,
      idempotencyKey: window.crypto.randomUUID(),
      amountMoney: {
        amount: Math.round(this.totalAmount * 100), // Amount in cents
        currency: 'USD'
      }
    });
    try {
      const paymentResponse = await fetch(`${this.baseUrl}payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors', 
        body,
      });

      if (paymentResponse.ok) {
        return paymentResponse.json();
      }

      const errorBody = await paymentResponse.text();
      throw new Error(errorBody);
    } catch (error) {
      console.error('Payment failed:', error);
      throw error;
  }  
  }

  private async tokenize(paymentMethod: any) {
    const tokenResult = await paymentMethod.tokenize();
    if (tokenResult.status === 'OK') {
      return tokenResult.token;
    } else {
      let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
      if (tokenResult.errors) {
        errorMessage += ` and errors: ${JSON.stringify(
          tokenResult.errors,
        )}`;
      }

      throw new Error(errorMessage);
    }
  }

  // Required in SCA Mandated Regions: Learn more at https://developer.squareup.com/docs/sca-overview
  private async verifyBuyer(payments: any, token: string): Promise<string>{
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

    const verificationResults = await payments.verifyBuyer(
      token,
      verificationDetails,
    );
    return verificationResults.token;
  }

  // status is either SUCCESS or FAILURE;
  private displayPaymentResults(status: string): void {
    this.statusContainer = document.getElementById(
      'payment-status-container',
    );

    if(this.statusContainer){
      if (status === 'SUCCESS') {
        this.statusContainer.classList.remove('is-failure');
        this.statusContainer.classList.add('is-success');
      } else {
        this.statusContainer.classList.remove('is-success');
        this.statusContainer.classList.add('is-failure');
      }
  
   this.statusContainer.style.visibility = 'visible';
    }
  }

  private async handlePaymentMethodSubmission(event: Event, card: any): Promise<void> {
    event.preventDefault();
    const cardButton = event.target as HTMLButtonElement;
    try {
      // disable the submit button as we await tokenization and make a payment request.
      cardButton.disabled = true;
      const token = await this.tokenize(card);
      const verificationToken = await this.verifyBuyer(this.payments, token);
      const paymentResults = await this.createPayment(token);
      this.displayPaymentResults('SUCCESS');

      console.debug('Payment Success', paymentResults);
    } catch (e) {
      cardButton.disabled = false;
      this.displayPaymentResults('FAILURE');
      console.error(e);
    }
  }


}