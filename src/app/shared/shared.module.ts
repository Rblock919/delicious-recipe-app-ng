import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StarComponent } from './components/star/star.component';
import { CollapsibleWellComponent } from './components/collapsible-well/collapsible-well.component';
import { IngredientsPipe } from './pipes/ingredients.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';
import { FilterByPipe } from './pipes/filter-by.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [],
  declarations: [
    StarComponent,
    CollapsibleWellComponent,
    IngredientsPipe,
    OrderByPipe,
    FilterByPipe
  ],
  exports: [
    StarComponent,
    CollapsibleWellComponent,
    IngredientsPipe,
    OrderByPipe,
    FilterByPipe
  ]
})
export class SharedModule { }
