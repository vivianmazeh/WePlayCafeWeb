import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/env';
import { catchError, map, Observable, throwError, retry, timer } from 'rxjs';

// Define Square types
interface SquarePayments {
  payments: (appId: string, locationId: string) => Promise<any>;
}

// Extend Window interface correctly
declare global {
  interface Window {
    Square: SquarePayments;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {
  private baseUrl: string;
  private readonly maxRetries = 3;
  private readonly API_PREFIX = '/api';

  constructor(private http: HttpClient) {
    // Use the current window location origin to determine the API base URL
    const currentOrigin = window.location.origin;
    this.baseUrl = currentOrigin.includes('www') 
      ? environment.baseUrl 
      : environment.baseUrl.replace('www.', '');
    
    console.log('Using base URL:', this.baseUrl);
  }

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

    return this.tryPaymentEndpoint(body);
  }

  private tryPaymentEndpoint(body: any): Observable<any> {
    const url = `${this.baseUrl}${this.API_PREFIX}/payment`;
    console.log(`Attempting payment request to: ${url}`);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });

    return this.makeRequest(url, body, headers);
  }

  private makeRequest(url: string, body: any, headers: HttpHeaders): Observable<any> {
    return this.http.post(url, body, {
      headers,
      withCredentials: true,
      observe: 'response'
    }).pipe( 
      catchError(error => {
        console.error('Payment request failed:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          headers: error.headers,
          error: error.error
        })
        return throwError(() => error);
      }),
      
    );
  }

  async initializeSquare(appId: string, locationId: string): Promise<any> {
    try {
      if (!window.Square) {
        throw new Error('Square.js failed to load properly');
      }

      const payments = await window.Square.payments(appId, locationId);
      console.log('Square payments initialized successfully');
      return payments;
    } catch (error) {
      console.error('Failed to initialize Square payments:', error);
      throw new Error('Unable to initialize payment system. Please refresh the page or try again later.');
    }
  }

  async verifyBuyer(
    payments: any, 
    token: string, 
    amount: number, 
    billingDetails: any
  ): Promise<string> {
    try {
      const verificationDetails = {
        amount: amount.toString(),
        billingContact: billingDetails,
        currencyCode: 'USD',
        intent: 'CHARGE'
      };

      console.log('Initiating buyer verification');
      const verificationResults = await payments.verifyBuyer(
        token, 
        verificationDetails
      );
      console.log('Buyer verification completed successfully');
      return verificationResults.token;
    } catch (error) {
      console.error('Buyer verification failed:', error);
      throw new Error(
        'Unable to verify payment information. Please check your details and try again.'
      );
    }
  }

  // Helper method to validate amount
  private validatePaymentAmount(amount: number): void {
    if (!amount || amount <= 0) {
      throw new Error('Invalid payment amount');
    }
    if (amount > 999999.99) { // Example maximum amount
      throw new Error('Payment amount exceeds maximum allowed');
    }
  }

  // Helper method to format amount for display
  public formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}

