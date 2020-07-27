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
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private commonService: CommonService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError( err => {
      if ([401, 403].indexOf(err.status) !== -1) {
          this.commonService.removeAccess();
      }
      const error = err.error.message || err.statusText;

      return throwError(error);
    }));
  }
}
