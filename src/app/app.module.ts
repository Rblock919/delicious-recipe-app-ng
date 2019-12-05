import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { PublicModule } from './common/public.module';
import { CoreModule } from './core.module';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    PublicModule
  ],
  providers: [],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
