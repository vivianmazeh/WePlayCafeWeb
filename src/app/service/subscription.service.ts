import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/env';
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private apiUrl = `${environment.baseUrl}/api/subscriptions`;
  constructor(private http: HttpClient) { }

  createSubscription(subscriptionData: any): Observable<any> {
    return this.http.post(this.apiUrl, subscriptionData);
  }

  cancelSubscription(subscriptionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${subscriptionId}/cancel`, {});
  }

  getSubscription(subscriptionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${subscriptionId}`);
  }
}
