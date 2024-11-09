import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/env';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


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
  private paymentFormContainer: HTMLElement | null = null;
  public videoOverPlay: HTMLButtonElement | null = null;
  public form:  HTMLFormElement | null = null;
  public cardButton: HTMLButtonElement | null = null;
  public isVideoVisible: boolean = false;  // Controls video visibility
  group15Options: number[] = [0,15,16, 17, 18, 19,20,21,22,23,24,25,26,27,
                              28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50]; 

  group10Options: number[] = [0,10, 11, 12, 13, 14]; 
  dailyPassOptions: number[] = [0,1,2,3,4,5,6,7,8,9]; 
  additionalPass: number[] = [0,1,2,3,4,5,6,7,8,9,10, 11, 12, 13, 14,15,16, 17, 18, 19,20];
  selectedOption = 0;
  public showSuccessModal: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}
  async ngOnInit(): Promise<void> {
    this.price = {   
      monthly_one: 60,
      monthly_two: 115,
      monthly_three: 165,
      monthly_four: 195,  
    };  
    this.form = document.getElementById('payment-form') as HTMLFormElement;
    this.cardButton = document.getElementById('card-button') as HTMLButtonElement;
    try {
      await this.initializeSquare();
    } catch (e) {
      console.error('Error during Square initialization', e);
    }
  // Set initial button state and add validation listeners to inputs
  this.initializeValidationListeners();
  this.takeInputsValues();
  }

     // Initialize form validation listeners and disable the Pay Now button initially
  private initializeValidationListeners(): void {
   
    if (this.form != null && this.cardButton != null) {
      this.cardButton.disabled = true; // Disable button initially

      this.form.addEventListener('input', () => {
        this.cardButton!.disabled = !this.form!.checkValidity(); // Enable button if form is valid
      });

         // Add event listener for click to trigger validation and submission
         this.cardButton.addEventListener('click', (event) => this.validateAndSubmitForm(event));
    }
  }
    // Validate form fields and conditionally submit if valid
    private async validateAndSubmitForm(event: Event): Promise<void> {
     
      if (this.form != null && this.form.checkValidity()) {
        this.form.classList.add('was-validated');
        await this.handlePaymentMethodSubmission(event, this.card); // Only call if form is valid
      } else {
        this.form!.classList.add('was-validated');
        event.preventDefault(); // Prevents the Square API call
        event.stopPropagation();
      }
    }

  private async initializeSquare() : Promise<void>{
    if (!window.Square) {
      throw new Error('Square.js failed to load properly');
    }
  
    try {
      this.payments = window.Square.payments(this.appId, this.locationId);

      // Validate configuration
      if (!this.appId || !this.locationId) {
        throw new Error('Missing required Square configuration');
      }

      this.card = await this.initializeCard(this.payments);

         // Add card field validation listener
      this.card.addEventListener('changeStatus', (event: any) => {
        const cardButton = document.getElementById('card-button') as HTMLButtonElement;
        cardButton.disabled = event.detail.status !== 'OK';
      });

    } catch(e) {
      console.error('Initializing Square Payments failed', e);
      this.statusContainer = document.getElementById(
        'payment-status-container',
      );

      if(this.statusContainer){
        this.statusContainer.className = 'missing-credentials';
        this.statusContainer.style.visibility = 'visible';
        this.statusContainer.textContent = 'Failed to initialize payment form. Please try again later.';
      }    
      throw e; 
    }
  
  }

  private async takeInputsValues(){
    const selectElements = document.querySelectorAll<HTMLSelectElement>('.form-select');
    selectElements.forEach(select => {
    
      // Update total price when the value changes
     select.addEventListener('change', () => this.updateTotalPrice());

    });   
  }
public updateTotalPrice() {
  
  this.totalPrice = 0;
  
  this.paymentFormContainer = document.getElementById('payment-form-container');
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

      if(this.paymentFormContainer)
        this.paymentFormContainer.style.display = this.totalPrice > 0 ? 'block' : 'none';
  }
 

  private async initializeCard(payments: any): Promise<any> {
    this.card = await payments.card();
    await this.card.attach('#card-container');
    return this.card;
  }

  private async createPayment(token: string, customerId: string): Promise<any> {
 
    const body = JSON.stringify({
      sourceId: token,
      idempotencyKey: window.crypto.randomUUID(), 
      amountMoney: {
        amount: Math.round(this.totalPrice * 100), // Amount in cents
        currency: 'USD'
      },
      customerId: customerId,
      customer: null
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
      amount: (this.totalPrice * 100).toString(),
      billingContact: {
        familyName: (document.getElementById('lastName') as HTMLInputElement).value,
        givenName: (document.getElementById('firstName') as HTMLInputElement).value,
        email: (document.getElementById('email') as HTMLInputElement).value,
        phoneNo: (document.getElementById('phoneNo') as HTMLInputElement).value
      },
      currencyCode: 'USD',
      intent: 'CHARGE'
    };

    try {
      const verificationResults = await payments.verifyBuyer(
        token,
        verificationDetails
      );
      return verificationResults.token;
    } catch (error) {
      console.error('Buyer verification failed:', error);
      throw error;
    }
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
    cardButton.disabled = true;

    try {
       // Validate form
      const form = document.getElementById('payment-form') as HTMLFormElement;
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      // disable the submit button as we await tokenization and make a payment request.
      cardButton.disabled = true;
      cardButton.textContent = 'Processing...';
     
       // Collect customer information from form inputs
       const firstName = (document.getElementById('firstName') as HTMLInputElement).value;
       const lastName = (document.getElementById('lastName') as HTMLInputElement).value;
       const email = (document.getElementById('email') as HTMLInputElement).value;
       const phoneNo = (document.getElementById('phoneNo') as HTMLInputElement).value;
        
      
       // Tokenize card
       const tokenResult = await this.tokenize(card);
       if (!tokenResult) {
         throw new Error('Card tokenization failed');
       }

         // Verify buyer
      const verificationToken = await this.verifyBuyer(this.payments, tokenResult);
      if (!verificationToken) {
        throw new Error('Buyer verification failed');
      }


         // Create customer with token
         const customerResponse = await this.createCustomer(
          firstName, 
          lastName, 
          email, 
          phoneNo,
          tokenResult  // Pass the token to createCustomer
        );
     
        if (!customerResponse) {
          throw new Error('Failed to create customer');
        }

       // Create payment
      const paymentResults = await this.createPayment(tokenResult, customerResponse.squareCustomerId);
      
      this.displayPaymentResults('SUCCESS');
      console.debug('Payment Success', paymentResults);

      // Clear form
        form.reset();
        form.classList.remove('was-validated');
         // Reset the card field
        await this.card.clear();

        // Hide the payment form container
        if (this.paymentFormContainer) {
          this.paymentFormContainer.style.display = 'none';
        }

         // Reset total price
        this.totalPrice = 0;
        this.updateTotalPrice();

        // Show success modal
       this.showSuccessModal = true;

    } catch (e) {
      cardButton.disabled = false;
      this.displayPaymentResults('FAILURE');
      console.error('Payment submission failed:',e);
    } finally{
      cardButton.disabled = false; // Re-enable button
      cardButton.textContent = 'Pay Now';
    }
  }
  
  // In card-payment.component.ts

private async createCustomer(firstName: string, lastName: string, email: string, phoneNo: string, token: string): Promise<any> {
  const body = JSON.stringify({
    sourceId: token,
    idempotencyKey: window.crypto.randomUUID(), // Added idempotency key
    amountMoney: null,
    customerId: null,
    customer: {
      givenName: firstName,
      familyName: lastName,
      emailAddress: email,
      phoneNumber: phoneNo,
    },
   
  });

  try {
    const customerResponse = await fetch(`${this.baseUrl}customer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      mode: 'cors',
      body,
    });

    if (!customerResponse.ok) {
      const errorText = await customerResponse.text();
      throw new Error(`Failed to create customer: ${errorText}`);
    }

    return customerResponse.json();
  } catch (error) {
    console.error('Customer creation failed:', error);
    throw error;
  }
}


  openVideo() {
    this.isVideoVisible = true;
  }

  closeVideo() {
    this.isVideoVisible = false;
  }
  

  public handleModalClose(): void {
    this.showSuccessModal = false;
    // Navigate to home page
    this.router.navigate(['/home']);
  }

}