import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RecipeSearchComponent } from './recipe-search/recipe-search.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeComponent } from './recipe/recipe.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';
import { SubmittedComponent } from './edit-recipe/submitted.component';
import { IngredientsPipe } from '../services/util/ingredients.pipe';
import { RouteGuard } from '../services/guards/route.guard';
import { RecipeResolverService } from '../services/resolvers/recipe-resolver.service';
import { StarComponent } from './star/star.component';
import { CollapsibleWellComponent } from './recipe-detail/collapsible-well/collapsible-well.component';
import { OrderByPipe } from '../services/util/order-by.pipe';
import { FilterByPipe } from '../services/util/filter-by.pipe';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'list',
        component: RecipeListComponent,
        resolve: { resolvedData: RecipeResolverService },
        data: { multipleRecipes: true }
      },
      {
        path: 'submitted',
        component: SubmittedComponent
      },
      {
        path: 'search',
        component: RecipeSearchComponent,
        resolve: { resolvedData: RecipeResolverService },
        data: { multipleRecipes: true }
      },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: { resolvedData: RecipeResolverService},
        data: { multipleRecipes: false }
      },
      {
        path: ':id/edit',
        component: EditRecipeComponent,
        canDeactivate: [RouteGuard],
        resolve: { resolvedData: RecipeResolverService },
        data: { context: 'editRecipe', multipleRecipes: false }
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      }
    ]),
    ReactiveFormsModule,
    CommonModule
  ],
  declarations: [
    RecipeSearchComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeComponent,
    EditRecipeComponent,
    SubmittedComponent,
    IngredientsPipe,
    OrderByPipe,
    FilterByPipe,
    StarComponent,
    CollapsibleWellComponent
  ],
  providers: []
})
export class RecipeModule { }
