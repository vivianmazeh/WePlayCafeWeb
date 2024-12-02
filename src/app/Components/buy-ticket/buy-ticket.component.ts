import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PaymentStateService } from 'src/app/service/payment-state.service';
import { SubscriptionService } from 'src/app/service/subscription.service';

interface Order {
  price: number;
  quantityOfOrder: number;
  sectionName: string;
  isMembership: boolean;
  numberOfChildrenAllowed: number;
}

interface SubscriptionPlan {
  id: string;
  children: string;
  price: number;
  childrenCount: number
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
    { id: 'PLAN_1_CHILDREN', children: 'One', price: 60, childrenCount: 1},
    { id: 'PLAN_2_CHILDREN', children: 'Two', price: 115, childrenCount: 2 },
    { id: 'PLAN_3_CHILDREN', children: 'Three', price: 165, childrenCount: 3 },
    { id: 'PLAN_4_CHILDREN', children: 'Four', price: 195, childrenCount: 4 }
  ];

  public selectedPlanId: string | undefined;
  private stateSubscription: Subscription | undefined;
  showPaymentForm = false;
  showSuccessModal = false;
  private destroy$ = new Subject<void>();
  activeTab: string = 'tickets';

  constructor(
    private paymentStateService: PaymentStateService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.takeInputsValues();
    this.stateSubscription = this.paymentStateService.state$.subscribe(state => {
      this.showPaymentForm = state.showForm;
      this.showSuccessModal = state.showSuccessModal;
    });
    this.paymentStateService.state$
    .pipe(takeUntil(this.destroy$))
    .subscribe(state => {
      this.showPaymentForm = state.showForm;
      this.showSuccessModal = state.showSuccessModal;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTabChange(event: any): void {
    this.totalPrice = 0;
    document.getElementById('total-price')!.innerText = this.totalPrice.toFixed(2);
    this.orderInfo = [];
    const  orderDetailsBody = document.getElementById('order-details-body');
    if (!orderDetailsBody) return;
    // Clear the table before updating
    orderDetailsBody.innerHTML = '';
    const tabId = event.target.getAttribute('data-bs-target');
    if (tabId) {
      this.activeTab = tabId.replace('#', '');
      this.showPaymentForm = false;
      this.selectedPlanId = undefined;
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
  
  const selectTicketsElements = document.querySelectorAll<HTMLSelectElement>('.form-select');
  const  orderDetailsBody = document.getElementById('order-details-body');
  if (!orderDetailsBody) return;

  // Clear the table before updating
  orderDetailsBody.innerHTML = '';

  selectTicketsElements.forEach(select => {
    const price = parseFloat(select.getAttribute('data-price') || '0');
    const quantity = parseInt(select.value, 10) || 0;
    const sectionName = select.getAttribute('aria-label') || 'Section';
  
    if (quantity > 0) {

      const order: Order = {
        price: price,
        quantityOfOrder: quantity,
        sectionName: sectionName,       
        isMembership: false,
        numberOfChildrenAllowed: 1 // if the order is not membership, then this variable is not useful
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
 
  public startSubscription(plan: SubscriptionPlan) {
    this.orderInfo = [];
    const order: Order = {
      price: plan.price,
      quantityOfOrder: 1,
      sectionName: `Membership for ${plan.children}`,
      isMembership: true,
      numberOfChildrenAllowed: plan.childrenCount
    };
    this.totalPrice = plan.price;
    document.getElementById('total-price')!.innerText = this.totalPrice.toFixed(2);
    this.selectedPlanId = plan.id;   
    const orderDetailsBody = document.getElementById('order-details-body');
    if (!orderDetailsBody ) return;
     // Clear the table before updating
     orderDetailsBody.innerHTML = '';  
      // Append a row to the table for the current selection
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${order.sectionName}</td>
          <td>$${order.price.toFixed(2)}</td>
          <td>1</td>
          <td>$${plan.price.toFixed(2)}</td>
      `;
        orderDetailsBody.appendChild(row);
        this.orderInfo.push(order);
       this.paymentStateService.updatePaymentState(plan.price, this.orderInfo );    

  }

 
  openVideo() {
    this.isVideoVisible = true;
  }

  closeVideo() {
    this.isVideoVisible = false;
  }

}