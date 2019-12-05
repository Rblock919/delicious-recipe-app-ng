import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { RecipeApiService } from './services/api/recipe-api.service';
import { SessionService } from './services/session.service';
import { AuthService } from './services/api/auth.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { LoggerService } from './services/util/logger.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    RecipeApiService,
    AuthService,
    SessionService,
    LoggerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  declarations: [],
  exports: []
})
export class CoreModule { }
