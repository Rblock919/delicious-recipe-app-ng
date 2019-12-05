import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Toastr, TOASTR_TOKEN } from './toastr.service';
import { JQ_TOKEN } from './jQuery.service';

const toastr: Toastr = window['toastr'];
const jQuery = window['$'];

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: TOASTR_TOKEN,
      useValue: toastr
    },
    {
      provide: JQ_TOKEN,
      useValue: jQuery
    }
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})
export class SharedModule { }
