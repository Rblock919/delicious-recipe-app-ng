import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { RecipeRoutingModule } from './recipe-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    RecipeRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    RecipeRoutingModule.components
  ],
  providers: []
})
export class RecipeModule { }
