import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/env';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

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

    const url = `${this.baseUrl}/customer`;

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
}
