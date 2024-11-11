import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/env';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { cu } from '@fullcalendar/core/internal-common';
import { PaymentServiceService } from 'src/app/service/payment-service.service';
import { CustomerServiceService } from 'src/app/service/customer-service.service';

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

  constructor(
    private paymentService: PaymentServiceService,
    private customerService: CustomerServiceService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.initializePrices();
    this.initializeFormElements();
    try {
      await this.initializeSquare();
    } catch (e) {
      console.error('Error during Square initialization', e);
    }
  // Set initial button state and add validation listeners to inputs
  this.initializeValidationListeners();
  this.takeInputsValues();
  }

  private initializePrices(): void {
    this.price = {
      monthly_one: 60,
      monthly_two: 115,
      monthly_three: 165,
      monthly_four: 195,
    };
  }

  private initializeFormElements(): void {
    this.form = document.getElementById('payment-form') as HTMLFormElement;
    this.cardButton = document.getElementById('card-button') as HTMLButtonElement;
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
    cardButton.textContent = 'Processing...';

    try {
      if (!this.validateForm()) return;

      const customerInfo = this.getCustomerInfo();
      const tokenResult = await this.tokenize(card);
      
      const verificationToken = await this.paymentService.verifyBuyer(
        this.payments,
        tokenResult,
        this.totalPrice * 100,
        {
          familyName: customerInfo.lastName,
          givenName: customerInfo.firstName,
          email: customerInfo.email,
          phoneNo: customerInfo.phoneNo
        }
      );

      const customerResponse = await this.customerService.createCustomer({
        sourceId: tokenResult,
        ...customerInfo
      }).toPromise();

      await this.paymentService.createPayment(
        tokenResult,
        customerResponse.squareCustomerId,
        this.totalPrice
      ).toPromise();

      this.handlePaymentSuccess();
    } catch (e) {
      this.handlePaymentError(e);
    } finally {
      this.resetCardButton(cardButton);
    }
  }
  
  private validateForm(): boolean {
    const form = document.getElementById('payment-form') as HTMLFormElement;
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return false;
    }
    return true;
  }

  private getCustomerInfo() {
    return {
      firstName: (document.getElementById('firstName') as HTMLInputElement).value,
      lastName: (document.getElementById('lastName') as HTMLInputElement).value,
      email: (document.getElementById('email') as HTMLInputElement).value,
      phoneNo: (document.getElementById('phoneNo') as HTMLInputElement).value
    };
  }
  // In card-payment.component.ts
  private handlePaymentSuccess(): void {
    this.displayPaymentResults('SUCCESS');
    this.resetForm();
    this.showSuccessModal = true;
  }

  private handlePaymentError(error: any): void {
    console.error('Payment submission failed:', error);
    this.displayPaymentResults('FAILURE');
  }

  private resetCardButton(button: HTMLButtonElement): void {
    button.disabled = false;
    button.textContent = 'Pay Now';
  }

  private resetForm(): void {
    if (this.form) {
      this.form.reset();
      this.form.classList.remove('was-validated');
    }
    this.card.clear();
    if (this.paymentFormContainer) {
      this.paymentFormContainer.style.display = 'none';
    }
    this.totalPrice = 0;
    this.updateTotalPrice();
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