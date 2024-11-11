import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/env';
import { catchError, map, Observable, throwError, retry, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {
  private baseUrl: string;
  private readonly maxRetries = 3;
  private readonly API_PREFIX = '/api';

  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseUrl;
    console.log('Using base URL:', this.baseUrl);
  }

  createCustomer(customerData: {
    sourceId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNo: string
  }): Observable<any> {
    const body = {
      sourceId: customerData.sourceId,
      idempotencyKey: window.crypto.randomUUID(),
      amountMoney: null,
      customerId: null,
      customer: {
        givenName: customerData.firstName,
        familyName: customerData.lastName,
        emailAddress: customerData.email,
        phoneNumber: customerData.phoneNo,
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });

    const url = `${this.baseUrl}${this.API_PREFIX}/customer`;
    
    return this.http.post(url, body, {
      headers,
      withCredentials: true,
      observe: 'response'
    }).pipe(
      retry({
        count: this.maxRetries,
        delay: (error, retryCount) => {
          const baseDelay = Math.min(1000 * Math.pow(2, retryCount), 5000);
          const jitter = Math.random() * 1000;
          return timer(baseDelay + jitter);
        }
      }),
      map(response => 'body' in response ? response.body : response),
      catchError((error: HttpErrorResponse) => {
        console.error('Request failed:', error);
        return throwError(() => error);
      })
    );
  }
}