import { Component, OnInit, OnDestroy, ViewEncapsulation, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/env';
import { PaymentServiceService } from 'src/app/service/payment-service.service';
import { CustomerServiceService } from 'src/app/service/customer-service.service';
import { PaymentStateService, Order } from 'src/app/service/payment-state.service';
import { Subscription, take } from 'rxjs';
import { SubscriptionService } from 'src/app/service/subscription.service';


interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
}

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.css',
  encapsulation: ViewEncapsulation.None
})
export class PaymentFormComponent implements OnInit, OnDestroy{

  private payments: any;
  private card: any;
  private locationId = environment.locationId;
  private appId = environment.applicationId;
  private statusContainer: any;
  private stateSubscription: Subscription | undefined;
  
  public form: HTMLFormElement | null = null;
  public cardButton: HTMLButtonElement | null = null;
  public showSuccessModal = false;
  public totalPrice = 0;
  public orderInfo: Order[] = [];
  public showForm = false;

  constructor(
    private paymentService: PaymentServiceService,
    private customerService: CustomerServiceService,
    private paymentStateService: PaymentStateService,
    private subscriptionService: SubscriptionService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.initializeSquare();
      this.initializeFormElements();
      this.initializeValidationListeners();
      this.subscribeToState();
    } catch (e) {
      console.error('Error during initialization:', e);
      this.displayPaymentResults('FAILURE');
    }
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  private subscribeToState(): void {
    this.stateSubscription = this.paymentStateService.state$.subscribe(state => {
      this.totalPrice = state.totalPrice;
      this.orderInfo = state.orderInfo;
      this.showForm = state.showForm;
      console.log('State updated:', state); 
     
    });
  }

  private async initializeSquare(): Promise<void> {
    if (!window.Square) {
      throw new Error('Square.js failed to load properly');
    }

    try {
      this.payments = window.Square.payments(this.appId, this.locationId);
      this.card = await this.initializeCard(this.payments);

      this.card.addEventListener('changeStatus', (event: any) => {
        if (this.cardButton) {
          this.cardButton.disabled = event.detail.status !== 'OK';
        }
      });
    } catch (e) {
      console.error('Initializing Square Payments failed:', e);
      throw e;
    }
  }

  private initializeFormElements(): void {
    this.form = document.getElementById('payment-form') as HTMLFormElement;
    this.cardButton = document.getElementById('card-button') as HTMLButtonElement;
    this.statusContainer = document.getElementById('payment-status-container');
  }

  private initializeValidationListeners(): void {
    if (this.form && this.cardButton) {
      this.cardButton.disabled = true;

      this.form.addEventListener('input', () => {
        if (this.cardButton) {
          this.cardButton.disabled = !this.form?.checkValidity();
        }
      });

      this.cardButton.addEventListener('click', (event) => this.handlePaymentSubmission(event));
    }
  }

  private async initializeCard(payments: any): Promise<any> {
    const card = await payments.card();
    await card.attach('#card-container');
    return card;
  }

  private async handlePaymentSubmission(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.validateForm()) return;

    const button = event.target as HTMLButtonElement;
    button.disabled = true;
    button.textContent = 'Processing...';

    try {
      const customerInfo = this.getCustomerInfo();
      const token = await this.tokenizeCard();
      
      const currentState = await this.paymentStateService.state$.pipe(take(1)).toPromise();
      if (!currentState) throw new Error('No payment state available');
      
      const customerResponse = await this.customerService.createCustomer({
        sourceId: token,
        ...customerInfo,
      }).toPromise();

      const isMembership = currentState.orderInfo.some(order => order.isMembership);
      if(isMembership){
        await this.subscriptionService.createSubscription(
          token,
          customerResponse.squareCustomerId,
          this.totalPrice,
          customerInfo,
          this.orderInfo
        ).toPromise();
      }else{
        await this.paymentService.createPayment(
          token,
          customerResponse.squareCustomerId,
          this.totalPrice,
          customerInfo,
          this.orderInfo
        ).toPromise();
  
        this.handlePaymentSuccess();
      } 
      }catch (error) {
        this.handlePaymentError(error);
      } finally {
        this.resetCardButton(button);
      }
     
  }

  private async tokenizeCard(): Promise<string> {
    const result = await this.card.tokenize();
    if (result.status === 'OK') {
      return result.token;
    }
    throw new Error(`Tokenization failed: ${result.status}`);
  }

  private validateForm(): boolean {
    if (!this.form?.checkValidity()) {
      this.form?.classList.add('was-validated');
      return false;
    }
    return true;
  }

  private getCustomerInfo(): CustomerInfo {
    return {
      firstName: (document.getElementById('firstName') as HTMLInputElement).value,
      lastName: (document.getElementById('lastName') as HTMLInputElement).value,
      email: (document.getElementById('email') as HTMLInputElement).value,
      phoneNo: (document.getElementById('phoneNo') as HTMLInputElement).value
    };
  }

  private handlePaymentSuccess(): void {

    this.displayPaymentResults('SUCCESS');
    this.resetForm();
    this.paymentStateService.setShowSuccessModal(true);
  }

  private handlePaymentError(error: any): void {
    console.error('Payment failed:', error);
    this.displayPaymentResults('FAILURE');
  }

  private displayPaymentResults(status: string): void {
    if (this.statusContainer) {
      this.statusContainer.style.visibility = 'visible';
      this.statusContainer.className = status === 'SUCCESS' ? 'is-success' : 'is-failure';
      this.statusContainer.textContent = status === 'SUCCESS' 
        ? 'Payment successful!'
        : 'Payment failed. Please try again.';
    }
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
    if (this.card) {
      this.card.clear();
    }
    this.paymentStateService.resetState();
  }

  public handleModalClose(): void {
    this.paymentStateService.setShowSuccessModal(false);
    setTimeout(() => {
      this.router.navigate(['/home']).then(() => {
        console.log('Navigation complete');
      }).catch(err => {
        console.error('Navigation failed:', err);
      });
    }, 300);
  }
  
}
