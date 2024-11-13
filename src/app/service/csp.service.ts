import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, map, shareReplay } from 'rxjs';
import { environment } from '../environments/env';

@Injectable({
  providedIn: 'root'
})
export class CSPService {

  private baseUrl: string;
  private readonly API_PREFIX = '/api';
  private currentNonce: string | null = null; 

  constructor(private http: HttpClient) { 
    this.baseUrl = environment.baseUrl;
   }

     // Get nonce from backend with caching
  getNonce(): Observable<string> {
    return this.http.get<{nonce: string}>(`${this.baseUrl}${this.API_PREFIX}/nonce`)
      .pipe(
        map(response => {
          this.currentNonce = response.nonce;
          return response.nonce;
        }),
        shareReplay(1), // Cache the latest nonce
        catchError(error => {
          console.error('Failed to fetch nonce:', error);
          return throwError(() => error);
        })
      );
  }

    // Create headers with nonce
    createHeadersWithNonce(nonce: string): HttpHeaders {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSP-Nonce': nonce
      });
    }
  
    // Get current nonce
    getCurrentNonce(): string | null {
      return this.currentNonce;
    }
}
