import { Injectable, Component } from '@angular/core';
import { CanActivate, Router, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { SessionService } from '../services/session.service';
import { EditRecipeComponent } from '../../recipes/edit-recipe/edit-recipe.component';
import { RegisterComponent } from '../../public/login/register.component';
import { LoggerService } from '../services/logger.service';

@Injectable(
  // { providedIn: 'root' }
)
export class RouteGuard implements CanActivate, CanDeactivate<Component> {

  constructor(
    private router: Router,
    private loggerService: LoggerService,
    private sessionService: SessionService) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const slices = state.url.split('/');
    // console.log(slices);

    if (slices[slices.length - 1] === 'edit') {
      const recipeId = route.params.id;

      // editing existing recipe
      if (recipeId !== '0') {

        // handling routing on refresh/directly entered URL
        if (this.sessionService.token && !this.sessionService.getUser) {
          setTimeout(() => {
            if (this.sessionService.isAdmin) {
              this.router.navigate(['/recipe', slices[2], 'edit']);
              return true;
            } else {
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
      } else { // adding new recipe
        return true;
      }
    }

    // console.log(state.url);
    // if (state.url === '/register') {
    if (slices[1] && slices[1] === 'register') {
        if (this.sessionService.isAuthenticated) {
          console.log('user is logged in an attempting to access register page');
          this.router.navigate(['home']);
          return false;
        } else {
          return true;
        }
    }

    // return true;

    // handle all other routes besides edit recipe and register
    if (slices[slices.length - 1] !== 'edit') {
      if (this.sessionService.isAuthenticated) {
        console.log('in route guard, and user is auth');
        return true;
      } else {
        this.loggerService.consoleLog('user is not auth, forwarding to login page and saving url');
        this.loggerService.consoleLog(`Route Path: ${state.url}`);
        this.sessionService.setRedirectUrl = state.url;
        // console.log('in route guard and user is not auth');
        this.router.navigate(['login']);
        return false;
      }
    }

  }

  public canDeactivate(component: Component, route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const context = route.data.context;
    let tempComponent: any;

    if (context === 'editRecipe') {
      tempComponent = component as EditRecipeComponent;
      if (tempComponent.recipeForm.dirty && !tempComponent.submitted) {
        const recipeName = tempComponent.recipeForm.get('title').value || 'New Recipe';
        return confirm(`Navigate away and lose all changes to ${recipeName}?`);
      }
      return true;
    } else if (context === 'register') {
      tempComponent = component as RegisterComponent;
      if (tempComponent.submitted === false && (tempComponent.userInfo.username !== ''
          || tempComponent.userInfo.password !== '' || tempComponent.confirmPassword)) {
        console.log('username or password(s) fields have been touched');
        return confirm('Navigate away and lose all changes to new profile?');
      } else {
        return true;
      }
    }

  }

}
