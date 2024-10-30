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
  public price: any;
  public totalPrice: number = 0; // Initial total
  private locationId = environment.locationId;
  private baseUrl = environment.baseUrl;
  private appId = environment.applicationId;
  private statusContainer: any;
  private proceedToPaymentButton: HTMLButtonElement | null = null;
  private paymentFormContainer: HTMLButtonElement | null = null;
  public videoOverPlay: HTMLButtonElement | null = null;
  public isVideoVisible: boolean = false;  // Controls video visibility
  group15Options: number[] = [0,15,16, 17, 18, 19,20,21,22,23,24,25,26,27,
                              28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50]; 

  group10Options: number[] = [0,10, 11, 12, 13, 14]; 
  dailyPassOptions: number[] = [0,1,2,3,4,5,6,7,8,9]; 
  additionalPass: number[] = [0,1,2,3,4,5,6,7,8,9,10, 11, 12, 13, 14,15,16, 17, 18, 19,20];
  selectedOption = 0;


  async ngOnInit(): Promise<void> {
    this.price = {   
      monthly_one: 60,
      monthly_two: 115,
      monthly_three: 165,
      monthly_four: 195,  
    };  
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
    const selectElements = document.querySelectorAll<HTMLSelectElement>('.form-select');
    selectElements.forEach(select => {
    
      // Update total price when the value changes
     select.addEventListener('change', () => this.updateTotalPrice());

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

public updateProceedButtonState() {
  if (this.proceedToPaymentButton) {
    if (this.totalPrice > 0) {
      this.proceedToPaymentButton.disabled = false; // Enable the button
    } else {
      this.proceedToPaymentButton.disabled = true;  // Disable the button
      if(this.paymentFormContainer)
         // hide the payment form when the totalAmont is equal to zero
        this.paymentFormContainer.style.display = 'none';
    }
  }
}
public updateTotalPrice() {
  
  this.totalPrice = 0;
  const selectElements = document.querySelectorAll<HTMLSelectElement>('.form-select');
  const orderDetailsBody = document.getElementById('order-details-body');
  if (!orderDetailsBody) return;

  // Clear the table before updating
  orderDetailsBody.innerHTML = '';

  selectElements.forEach(select => {
    const price = parseFloat(select.getAttribute('data-price') || '0');
    const quantity = parseInt(select.value, 10) || 0;
    const sectionName = select.getAttribute('aria-label') || 'Section';
  
    if (quantity > 0) {
      const sectionTotal = price * quantity;
      this.totalPrice += sectionTotal;

      // Append a row to the table for the current selection
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${sectionName}</td>
          <td>$${price.toFixed(2)}</td>
          <td>${quantity}</td>
          <td>$${sectionTotal.toFixed(2)}</td>
      `;
      orderDetailsBody.appendChild(row);
  }
  });
   
    document.getElementById('total-price')!.innerText = this.totalPrice.toFixed(2);

    

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
        amount: Math.round(this.totalPrice * 100), // Amount in cents
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
  
  
  openVideo() {
    this.isVideoVisible = true;
  }

  closeVideo() {
    this.isVideoVisible = false;
  }
  

}