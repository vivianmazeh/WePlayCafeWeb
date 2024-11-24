import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Order {
  price: number;
  quantity: number;
  sectionName: string;
}
export interface PaymentState {
  totalPrice: number;
  orderInfo: Order[];
  showForm: boolean;
  showSuccessModal: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentStateService {

  private state = new BehaviorSubject<PaymentState>({
    totalPrice: 0,
    orderInfo: [],
    showForm: false,
    showSuccessModal: false
  });

  state$ = this.state.asObservable();

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

  resetState() {
    this.state.next({
      totalPrice: 0,
      orderInfo: [],
      showForm: false,
      showSuccessModal: false
    });
  }
}


