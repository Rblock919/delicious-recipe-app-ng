import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from '../navbar/navbar.component';
import { LogoutComponent } from './login/logout.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './login/register.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { SplashPageComponent } from './user-home/splash-page.component';
import { SharedModule } from '../shared/shared.module';
import { ErrorComponent } from './error/error.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  declarations: [
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    PageNotFoundComponent,
    UserHomeComponent,
    SplashPageComponent,
    NavbarComponent,
    ErrorComponent
  ],
  exports: [
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    PageNotFoundComponent,
    UserHomeComponent,
    SplashPageComponent,
    NavbarComponent,
    ErrorComponent
  ]
})
export class PublicModule { }
