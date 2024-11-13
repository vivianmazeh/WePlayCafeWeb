import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CSPService } from './csp.service';

@Injectable()
export class CSPInterceptor implements HttpInterceptor {
  constructor(private cspService: CSPService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Don't add nonce header to the nonce request itself
    if (request.url.endsWith('/api/nonce')) {
      return next.handle(request);
    }

    const currentNonce = this.cspService.getCurrentNonce();
    if (currentNonce) {
      const modifiedRequest = request.clone({
        headers: request.headers.set('X-CSP-Nonce', currentNonce)
      });
      return next.handle(modifiedRequest);
    }

    return next.handle(request);
  }
}