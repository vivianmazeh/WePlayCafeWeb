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
  public quantity10: number = 0;
  public quantity15: number = 0;
  private proceedToPaymentButton: HTMLButtonElement | null = null;
  private paymentFormContainer: HTMLButtonElement | null = null;
  private quantityInputs: NodeListOf<HTMLInputElement> | null = null;


  async ngOnInit(): Promise<void> {
    try {
      await this.initializeSquare();
    } catch (e) {
      console.error('Error during Square initialization', e);
    }
    this.takeInputsValues();  
  }


  private async initializeSquare() : Promise<void>{
    if (!window.Square) {
      throw new Error('Square.js failed to load properly');
    }

    
    try {
      console.log('Location ID:', this.locationId);
      console.log('if Evn is production:', environment.production);
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

  private async takeInputsValues(){
    // Ensure total price is updated on quantity change
    this.quantityInputs = document.querySelectorAll('.quantity-input') as NodeListOf<HTMLInputElement>;
    this.quantityInputs.forEach(input => {
    
      // Update total price when the value changes
     input.addEventListener('blur', () => this.updateTotalPrice());
    });

    this.proceedToPaymentButton = document.getElementById('proceed-to-payment-button') as HTMLButtonElement | null;
    this.updateProceedButtonState();

    // Handle click event on Proceed to Payment button
    if (this.proceedToPaymentButton) {
      this.proceedToPaymentButton.addEventListener('click', () => {
        this.paymentFormContainer = document.getElementById('payment-form-container') as HTMLButtonElement | null;
        if (this.paymentFormContainer) {
          // Show the payment form when the button is clicked
          this.paymentFormContainer.style.display = 'block';
        }
      });
    }
}

private updateProceedButtonState() {
  if (this.proceedToPaymentButton) {
    if (this.totalAmount > 0) {
      this.proceedToPaymentButton.disabled = false; // Enable the button
    } else {
      this.proceedToPaymentButton.disabled = true;  // Disable the button
      if(this.paymentFormContainer)
         // hide the payment form when the totalAmont is equal to zero
        this.paymentFormContainer.style.display = 'none';
    }
  }
}
  private updateTotalPrice() {
  
    let totalPrice = 0;
  
    if(this.quantityInputs)
      this.quantityInputs.forEach(input => {

        const price = parseFloat(input.getAttribute('data-price') || '0');
        let quantity = parseInt(input.value, 10);
        if(quantity != 0){
          if (input.id === 'quantity10'){
          
            if(quantity < 10){
              quantity = 10;
              input.value = '10';
            }
             
          }else if(input.id === 'quantity15'){
            if(quantity < 15){
              quantity = 15;
              input.value = '15';
            }
             
          }
        }
        totalPrice += price * quantity;
      });

    this.totalAmount = totalPrice;
    document.getElementById('total-price')!.innerText = totalPrice.toFixed(2);

    this.updateProceedButtonState();
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
      this.statusContainer.style.visibility = 'visible';
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