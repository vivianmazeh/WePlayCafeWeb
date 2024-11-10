import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  createPayment(token: string, customerId: string, amount: number): Observable<any> {
    const body = {
      sourceId: token,
      idempotencyKey: window.crypto.randomUUID(),
      amountMoney: {
        amount: Math.round(amount * 100), // Amount in cents
        currency: 'USD'
      },
      customerId: customerId,
      customer: null
    };

    return this.http.post(`${this.baseUrl}/payment`, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true
    });
  }

  async initializeSquare(appId: string, locationId: string) {
    if (!window.Square) {
      throw new Error('Square.js failed to load properly');
    }

    return window.Square.payments(appId, locationId);
  }

  async verifyBuyer(payments: any, token: string, amount: number, billingDetails: any): Promise<string> {
    const verificationDetails = {
      amount: amount.toString(),
      billingContact: billingDetails,
      currencyCode: 'USD',
      intent: 'CHARGE'
    };

    const verificationResults = await payments.verifyBuyer(token, verificationDetails);
    return verificationResults.token;
  }
}
