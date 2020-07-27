import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CommonService } from '../services/common.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private commonService: CommonService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const isLoggedIn = this.commonService.isLoggedIn();
        const token = this.commonService.getToken();
        if (isLoggedIn) {
          request = request.clone({
              setHeaders:
                  { Authorization: `Bearer ${token}` }
              }
          );
      }
      else {
        this.commonService.removeAccess();
      }
        
      return next.handle(request);
  }
}
