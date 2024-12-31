import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Order {
  price: number;
  quantityOfOrder: number;
  sectionName: string;
  isMembership: boolean;
  numberOfChildrenAllowed: number;
}
export interface PaymentState {
  totalPrice: number;
  orderInfo: Order[];
  showForm: boolean;
  showSuccessModal: boolean;
}
export interface MenuItem {
  name: string;
  price: number;
  description: string;
  category: string;
  unit: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentStateService {

  public state = new BehaviorSubject<PaymentState>({
    totalPrice: 0,
    orderInfo: [],
    showForm: false,
    showSuccessModal: false
  });

  state$ = this.state.asObservable();

  updatePaymentStateFromMenuItems(menuItems: MenuItem[]) {
    const orderInfo: Order[] = menuItems
      .filter(item => item.quantity > 0)
      .map(item => ({
        price: item.price,
        quantityOfOrder: item.quantity,
        sectionName: item.name,
        isMembership: false, // Default value for menu items
        numberOfChildrenAllowed: 0 // Default value for menu items
      }));
      const totalPrice = orderInfo.reduce((sum, order) => 
        sum + (order.price * order.quantityOfOrder), 0
      );

      const currentState = this.state.getValue();
      this.state.next({
        ...currentState,
        totalPrice,
        orderInfo,
        showForm: currentState.showForm 
      });
    }
  

  updatePaymentState(totalPrice: number, orderInfo: Order[]) {
    const currentState = this.state.getValue();
    this.state.next({
      ...currentState,
      totalPrice,
      orderInfo,
      showForm: totalPrice > 0
    });
  }

  getCurrentState(): PaymentState {
    return this.state.getValue();
  }
 
  setShowSuccessModal(show: boolean) {
    const currentState = this.state.getValue();
    this.state.next({
      ...currentState,
      showSuccessModal: show
    });
  }

  isMembershipOrder(): boolean {
    const currentState = this.state.getValue();
    return currentState.orderInfo.some(order => order.isMembership);
  }

  resetState() {
    this.state.next({
      totalPrice: 0,
      orderInfo: [],
      showForm: false,
      showSuccessModal: false
    });
  }
}


