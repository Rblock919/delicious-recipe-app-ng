import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeResolverService } from '../core/resolvers/recipe-resolver.service';
import { SubmittedComponent } from './edit-recipe/submitted.component';
import { RecipeSearchComponent } from './recipe-search/recipe-search.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';
import { RouteGuard } from '../core/guards/route.guard';
import { RecipeComponent } from './recipe/recipe.component';

const routes: Routes = [
  {
    path: 'list',
    component: RecipeListComponent,
    resolve: { resolvedData: RecipeResolverService },
    data: { multipleRecipes: true, context: 'list' }
  },
  {
    path: 'submitted',
    component: SubmittedComponent
  },
  {
    path: 'search',
    component: RecipeSearchComponent,
    resolve: { resolvedData: RecipeResolverService },
    data: { multipleRecipes: true, context: 'list' }
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
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RecipeRoutingModule {
  static components = [
    RecipeComponent,
    RecipeDetailComponent,
    RecipeListComponent,
    EditRecipeComponent,
    RecipeSearchComponent,
    SubmittedComponent
  ];
}
