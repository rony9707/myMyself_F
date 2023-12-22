import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserdataService } from './userdata.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }


  intercept(req, next) {

    let userDataService = this.injector.get(UserdataService)
    let tokenizedreq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${userDataService.getToken()}`
      }
    })
    return next.handle(tokenizedreq)
  }
}
