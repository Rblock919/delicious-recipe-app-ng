import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SessionService } from '../services/session.service';

@Injectable(
  // { providedIn: 'root' }
)
export class IndexGuard implements CanActivate {

  constructor(private sessionService: SessionService, private router: Router) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.sessionService.isAuthenticated) {
      this.router.navigate(['home']);
      return false;
    } else {
      return true;
    }

  }

}
