import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/env';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { CSPService } from './csp.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {
  private baseUrl: string;
  private readonly API_PREFIX = '/api';

  constructor(private http: HttpClient,  private cspService: CSPService) {
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

   
       // Use CSP service to get nonce and create headers
       return this.cspService.getNonce().pipe(
        switchMap(nonce => {
          const url = `${this.baseUrl}${this.API_PREFIX}/customer`;
          return this.http.post(url, body, {
            headers: this.cspService.createHeadersWithNonce(nonce),
            withCredentials: true,
          });
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Request failed in createCustomer:', error);
          return throwError(() => error);
        })
      );
    }      
}