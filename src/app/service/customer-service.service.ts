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

  constructor(private http: HttpClient) {
    // Ensure baseUrl is properly formatted without trailing slash
    this.baseUrl = environment.baseUrl.replace(/\/$/, '');
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

    return this.tryEndpoints(body);
  }

  private tryEndpoints(body: any): Observable<any> {
    const endpoints = [
      '/customer',    // Try without trailing slash first
      '/customer/',   // Try with trailing slash if first attempt fails
    ];

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Origin': window.location.origin // Add origin header explicitly
    });

    return this.tryNextEndpoint(endpoints, 0, body, headers);
  }

  private tryNextEndpoint(endpoints: string[], index: number, body: any, headers: HttpHeaders): Observable<any> {
    if (index >= endpoints.length) {
      return throwError(() => new Error('All endpoint attempts failed'));
    }

    const endpoint = endpoints[index];
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`Attempting request to: ${url}`);

    return this.makeRequest(url, body, headers).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(`Request to ${url} failed with status ${error.status}`);
        if (error.status === 301 || error.status === 302 || error.status === 404 || error.status === 0) {
          // Also catch status 0 which often indicates CORS issues
          return this.tryNextEndpoint(endpoints, index + 1, body, headers);
        }
        return throwError(() => error);
      })
    );
  }

  private makeRequest(url: string, body: any, headers: HttpHeaders): Observable<any> {
    return this.http.post(url, body, {
      headers,
      withCredentials: true,
      observe: 'response'
    }).pipe(
      retry({
        count: this.maxRetries,
        delay: (error, retryCount) => {
          // Exponential backoff with jitter
          const jitter = Math.random() * 1000;
          const delay = Math.min(1000 * Math.pow(2, retryCount) + jitter, 10000);
          console.log(`Retrying request attempt ${retryCount + 1} after ${delay}ms`);
          return timer(delay);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Request failed:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          headers: error.headers,
          error: error.error
        });

        if (typeof error.error === 'string' && error.error.includes('<!doctype html>')) {
          console.log('Received HTML response instead of API response');
          return throwError(() => new Error('Received invalid API response'));
        }

        // Enhanced error handling for CORS
        if (error.status === 0 && error.error instanceof ProgressEvent) {
          console.log('CORS error detected');
          return throwError(() => new Error('CORS error: Unable to access the API'));
        }

        return throwError(() => error);
      }),
      map(response => 'body' in response ? response.body : response)
    );
  }
}