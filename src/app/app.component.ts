import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart,
  NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';

import { SessionService } from './core/services/session.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Recipe Application';
  loading = true;

  constructor(private sessionService: SessionService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });
    // application reloaded or user refreshed before logging out, persist user data to new instance of application
    if (!this.sessionService.getUser && this.sessionService.isAuthenticated) {
      this.authService.getUserData().subscribe(res => {
        this.sessionService.setUser(res.user);
      }, err => {
        console.error(`ERR GETTING USER FROM APP COMPONENT ONINIT METHOD: ${JSON.stringify(err)}`);
        this.sessionService.logout();
      });
    }
  }

  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }

    if (routerEvent instanceof NavigationEnd ||
        routerEvent instanceof NavigationCancel ||
        routerEvent instanceof NavigationError) {
          this.loading = false;
    }
  }
}
