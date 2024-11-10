import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/env';
import { catchError, map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  createPayment(token: string, customerId: string, amount: number): Observable<any> {

    const url = `${this.baseUrl}/payment`;

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

    return this.http.post(url, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true,
      observe: 'response' 
    }).pipe(
        map(response => response.body),
        catchError(error => {

          if (error.status === 301 || error.status === 302) {
            const redirectUrl = error.headers.get('Location');
            if (redirectUrl) {
              // Follow the redirect
              return this.http.post(redirectUrl, body, {
                headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }),
                withCredentials: true
              });
            }
          }
          console.error('Customer API Error:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            headers: error.headers,
            error: error.error
          });
          throw error;
        })
    );
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
