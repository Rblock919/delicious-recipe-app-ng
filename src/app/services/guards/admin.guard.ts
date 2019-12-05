import { SessionService } from '../session.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, CanLoad, Route, UrlSegment } from '@angular/router';

@Injectable(
  { providedIn: 'root' }
)
export class AdminGuard implements CanActivate, CanLoad {

  constructor(private sessionService: SessionService, private router: Router) { }

  canLoad(route: Route, segments: UrlSegment[]): boolean {

    // user is authenticated but no user data in session, generated new instance of app by either
    // entering direct URL or refreshing the app. Wait a bit for session service to retrieve userdata
    if (this.sessionService.isAuthenticated && !this.sessionService.getUser) {

      setTimeout(() => {

        if (this.sessionService.getUser && this.sessionService.getUser.isAdmin) {

          let redirectUrl = 'admin';
          if (segments.length > 2) {
            redirectUrl += ('/' + segments[1]);
            redirectUrl += ('/' + segments[2]);
          } else {
            redirectUrl += ('/' + segments[1]);
          }

          console.log('returning true in timeout');
          console.log(`RedirectUrl: ${redirectUrl}`);
          this.router.navigate([redirectUrl]);
          return true;
        } else {
          console.log('returning false');
          this.router.navigate(['home']);
          return false;
        }

      }, 400);
    } else {
      if (this.sessionService.isAdmin) {
        return true;
      } else {
        this.router.navigate(['/index']);
        return false;
      }
    }

  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('in admin guard');

    if (this.sessionService.isAuthenticated && !this.sessionService.getUser) {
      // user is authenticated but no user data in session, generated new instance of app by either
      // entering direct URL or refreshing the app. Wait a bit for session service to retrieve userdata
        setTimeout(() => {
          if (this.sessionService.getUser && this.sessionService.getUser.isAdmin) {
            // console.log('returning true');
            // console.log('state url: ' + state.url);
            this.router.navigate([state.url]);
            return true;
          } else {
            // console.log('returning false');
            this.router.navigate(['home']);
            return false;
          }
        }, 400);
      } else {
          if (this.sessionService.isAdmin) {
            return true;
          } else {
            this.router.navigate(['home']);
            return false;
          }
      }

  }

}
