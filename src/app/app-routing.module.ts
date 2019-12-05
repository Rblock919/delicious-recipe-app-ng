import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AdminGuard } from './core/guards/admin.guard';
import { RouteGuard } from './core/guards/route.guard';
import { IndexGuard } from './core/guards/index.guard';
import { SelectiveStrategy } from './core/strategies/selective-strategy.service';
import { UserHomeComponent } from './public/home/user-home.component';
import { RegisterComponent } from './public/login/register.component';
import { LoginComponent } from './public/login/login.component';
import { LogoutComponent } from './public/login/logout.component';
import { SplashPageComponent } from './public/home/splash-page.component';
import { PageNotFoundComponent } from './public/page-not-found/page-not-found.component';
import { ErrorComponent } from './public/error/error.component';

const routes: Routes = [
  { path: 'index', component: SplashPageComponent, canActivate: [IndexGuard] },
  { path: 'home', component: UserHomeComponent, canActivate: [RouteGuard] },
  {
    path: 'recipe',
    loadChildren: 'src/app/recipes/recipe.module#RecipeModule',
    canActivate: [RouteGuard],
    data: { preload: true }
  },
  {
    path: 'admin',
    loadChildren: 'src/app/admin/admin.module#AdminModule',
    canLoad: [AdminGuard],
    canActivate: [AdminGuard],
    data: { preload: false }
  },
  { path: 'register',
    component: RegisterComponent,
    canActivate: [RouteGuard], canDeactivate: [RouteGuard],
    data: { context: 'register' }
  },
  { path: 'login', component: LoginComponent, canActivate: [IndexGuard] },
  { path: 'logout', component: LogoutComponent },
  { path: '', pathMatch: 'full', redirectTo: 'index'},
  { path: 'error', component: ErrorComponent }, // remove eventually
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: SelectiveStrategy})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
