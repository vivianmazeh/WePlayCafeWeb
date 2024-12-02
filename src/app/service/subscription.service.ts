import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../environments/env';
import { CSPService } from './csp.service';
import { PaymentStateService } from './payment-state.service';

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
}

interface Order {
  price: number;
  quantityOfOrder: number;
  sectionName: string;
  isMembership: boolean;
  numberOfChildrenAllowed: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private baseUrl: string;
  private readonly API_PREFIX = '/api';

    constructor(private http: HttpClient, 
              private cspService: CSPService,
              private paymentStateService: PaymentStateService ) {
    // Use the current window location origin to determine the API base URL
    const currentOrigin = window.location.origin;
    this.baseUrl = currentOrigin.includes('www') 
      ? environment.baseUrl 
      : environment.baseUrl.replace('www.', '');
  }
  ngOnDestroy() {
    this.paymentStateService.setShowSuccessModal(false);
  }
  createSubscription(token: string, 
                      customerId: string, 
                      amount: number, 
                      customerData: CustomerData,
                      orderInfo: Array<Order>): Observable<any> {
    const url = `${this.baseUrl}${this.API_PREFIX}/subscriptions`;
     // Find the membership order
     const membershipOrder = orderInfo.find(order => order.isMembership);
     if (!membershipOrder) {
       return throwError(() => new Error('No membership order found'));
     }
     
    const body = {
      sourceId: token,
      idempotencyKey: window.crypto.randomUUID(),
      amountMoney: {
        amount: Math.round(amount * 100), // Amount in cents
        currency: 'USD'
        },
      customerId: customerId,
      customer: {
        givenName:  customerData.firstName,
        familyName:  customerData.lastName,
        emailAddress:  customerData.email,
        phoneNumber:  customerData.phoneNo,
      },
      buyerEmailAddress:customerData.email,
      orderInfo: orderInfo
    }
    return this.cspService.getNonce().pipe(
      switchMap(nonce => {
        return this.http.post(url,body, {
          headers: this.cspService.createHeadersWithNonce(nonce),
          withCredentials: true,
        });
      }),
      tap(() => {
        // Show success modal after successful subscription creation
        this.paymentStateService.setShowSuccessModal(true);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Payment request failed:', error);
        return throwError(() => error);
      })
    );
  }

  getSubscriptionDetails(subscriptionId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${this.API_PREFIX}/${subscriptionId}`);
  }

  confirmCancellation(subscriptionId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.API_PREFIX}/cancel-subscription/${subscriptionId}/confirm`, {});
  }
}
