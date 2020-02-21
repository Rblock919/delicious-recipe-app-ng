import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';

import { SessionService } from '../services/session.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req, next) {
    const session = this.injector.get(SessionService);

    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'token ' + session.token),
      withCredentials: true
    });

    return next.handle(authRequest);
  }

}
