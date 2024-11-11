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
  private readonly API_PREFIX = '/api'; // Add API prefix

  constructor(private http: HttpClient) {
    // Use the current window location origin to determine the API base URL
    const currentOrigin = window.location.origin;
    this.baseUrl = currentOrigin.includes('www') 
      ? environment.baseUrl 
      : environment.baseUrl.replace('www.', '');
    
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
      `${this.API_PREFIX}/customer`,      // Try with API prefix
      `${this.API_PREFIX}/customer/`
    ];

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
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
        console.error(`Request to ${url} failed:`, error);
        
        // Handle specific error cases
        if (error.status === 301 || error.status === 302) {
          const redirectUrl = error.headers.get('Location');
          if (redirectUrl) {
            console.log(`Following redirect to: ${redirectUrl}`);
            return this.makeRequest(redirectUrl, body, headers);
          }
        }
        
        // Check if we received HTML instead of JSON
        if (typeof error.error === 'string' && error.error.includes('<!doctype html>')) {
          console.log('Received HTML response, trying next endpoint');
          return this.tryNextEndpoint(endpoints, index + 1, body, headers);
        }
        
        if (error.status === 404 || error.status === 0) {
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
          if (typeof error.error === 'string' && error.error.includes('<!doctype html>')) {
            return timer(0); // Don't retry HTML responses
          }
          const baseDelay = Math.min(1000 * Math.pow(2, retryCount), 5000);
          const jitter = Math.random() * 1000;
          return timer(baseDelay + jitter);
        },
        resetOnSuccess: true
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Request failed:', error);
        return throwError(() => error);
      }),
      map(response => 'body' in response ? response.body : response)
    );
  }
}