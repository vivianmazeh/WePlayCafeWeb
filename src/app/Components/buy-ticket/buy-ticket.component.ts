import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaymentStateService } from 'src/app/service/payment-state.service';
import { SubscriptionService } from 'src/app/service/subscription.service';

interface Order {
  price: number;
  quantity: number;
  sectionName: string;
}

@Component({
  selector: 'app-card-payment',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['./buy-ticket.component.css'],
})
export class BuyTicketComponent implements OnInit, OnDestroy {
 
  public price: any;
  public totalPrice: number = 0; // Initial total
  public videoOverPlay: HTMLButtonElement | null = null;
  public isVideoVisible: boolean = false;  // Controls video visibility
  group15Options: number[] = [0,15,16, 17, 18, 19,20,21,22,23,24,25,26,27,
                              28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50]; 

  group10Options: number[] = [0,10, 11, 12, 13, 14]; 
  dailyPassOptions: number[] = [0,1,2,3,4,5,6,7,8,9]; 
  additionalPass: number[] = [0,1,2,3,4,5,6,7,8,9,10, 11, 12, 13, 14,15,16, 17, 18, 19,20];
  selectedOption = 0;

  public orderInfo: Array<Order> = [];
  public subscriptionPlans = [
    { id: 'PLAN_1_CHILDREN', children: 1, price: 60},
    { id: 'PLAN_2_CHILDREN', children: 2, price: 115 },
    { id: 'PLAN_3_CHILDREN', children: 3, price: 165 },
    { id: 'PLAN_4_CHILDREN', children: 4, price: 195 }
  ];

  public selectedPlanId: string | undefined;
  private stateSubscription: Subscription | undefined;
  showPaymentForm = false;
  showSuccessModal = false;

  constructor(
    private subscriptionService: SubscriptionService,
    private paymentStateService: PaymentStateService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.takeInputsValues();
    this.stateSubscription = this.paymentStateService.state$.subscribe(state => {
      this.showPaymentForm = state.showForm;
      this.showSuccessModal = state.showSuccessModal;
    });
  }

  ngOnDestroy() {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  handleModalClose() {
    this.paymentStateService.setShowSuccessModal(false);
    setTimeout(() => {
      this.router.navigate(['/home']).then(() => {
        console.log('Navigation complete');
      }).catch(err => {
        console.error('Navigation failed:', err);
      });
    }, 300);
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
  this.orderInfo = [];
  
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

      const order: Order = {
        price: price,
        quantity: quantity,
        sectionName: sectionName
    };

      this.orderInfo.push(order);
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
    this.paymentStateService.updatePaymentState(this.totalPrice, this.orderInfo);
    console.log('Updated total price:', this.totalPrice); 
  }
 
  async startSubscription(planId: string) {
    this.selectedPlanId = planId;
    this.showPaymentForm = true;
    if (!this.selectedPlanId) return;
    
    try {
      const result = await this.subscriptionService.createSubscription(this.selectedPlanId);
      // Handle successful subscription
      this.showPaymentForm = false;
      // Redirect to success page or show confirmation
    } catch (error) {
      console.error('Payment failed:', error);
      // Handle error
    }
  }
  openVideo() {
    this.isVideoVisible = true;
  }

  closeVideo() {
    this.isVideoVisible = false;
  }

}