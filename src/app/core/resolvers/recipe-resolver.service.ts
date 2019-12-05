import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IRecipeResolved, IRecipesResolved, IRecipesGQLResolved, IRecipeGQLResolved } from 'src/app/models/recipe.model';
import { RecipeApiService } from '../services/api/recipe-api.service';

@Injectable(
  // { providedIn: 'root' }
)
export class RecipeResolverService implements Resolve<IRecipeResolved | IRecipesResolved | IRecipesGQLResolved> {

  constructor(private recipeApiService: RecipeApiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Observable<IRecipeResolved> | Promise<IRecipeResolved> | IRecipeResolved
  | Observable<IRecipesResolved>  | Promise<IRecipesResolved> | IRecipesResolved
  | Observable<IRecipesGQLResolved> | Promise<IRecipesGQLResolved> | IRecipesGQLResolved {

    const { context, multipleRecipes } = route.data;

    if (multipleRecipes) {
      if (context === 'list') {
        return this.recipeApiService.getRecipeList()
          .pipe(map(graphQLRes => ({recipes: graphQLRes.data.recipes})),
            catchError(error => {
              console.error(error);
              return of ({recipes: null, error});
            })
          );
      } else if (context === 'edit') {
        return this.recipeApiService.getRecipeEditList()
          .pipe(map(graphQLRes => ({recipes: graphQLRes.data.recipes})),
            catchError(error => {
              console.error(error);
              return of ({recipes: null, error});
            })
          );
      }

      // return this.recipeApiService.getRecipeList()
      //   .pipe(map(recipes => ({recipes})),
      //   catchError(error => {
      //     console.error(error);
      //     return of ({recipes: null, error});
      //   })
      // );
    } else {
      const id = route.params.id;

      // user is adding new recipe
      if (id === '0') {
        return {recipe: null, error: null};
      }

      return this.recipeApiService.getRecipe(id)
        .pipe(map(recipe => ({recipe})),
        catchError(error => {
          // console.error(error);
          return of ({recipe: null, error});
        })
      );
    }

  }

}
