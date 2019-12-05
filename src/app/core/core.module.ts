import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { RecipeApiService } from './services/api/recipe-api.service';
import { SessionService } from './services/session.service';
import { AuthService } from './services/auth.service';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { LoggerService } from './services/logger.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { Toastr, TOASTR_TOKEN } from './services/toastr.service';
import { JQ_TOKEN } from './services/jQuery.service';
import { RecipeResolverService } from './resolvers/recipe-resolver.service';
import { GraphqlService } from './services/api/graphql.service';
import { IndexGuard } from './guards/index.guard';
import { RouteGuard } from './guards/route.guard';
import { SelectiveStrategy } from './strategies/selective-strategy.service';

const toastr: Toastr = window['toastr'];
const jQuery = window['$'];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    RecipeApiService,
    GraphqlService,
    RecipeResolverService,
    AuthService,
    SessionService,
    LoggerService,
    SelectiveStrategy,
    IndexGuard,
    RouteGuard,
    {
      provide: TOASTR_TOKEN,
      useValue: toastr
    },
    {
      provide: JQ_TOKEN,
      useValue: jQuery
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  declarations: [],
  exports: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
