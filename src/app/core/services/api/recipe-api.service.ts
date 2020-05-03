import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IRecipe } from '../../../models/recipe.model';
import { GraphqlService } from './graphql.service';

@Injectable()
// { providedIn: 'root' }
export class RecipeApiService {
  constructor(
    private httpClient: HttpClient,
    private graphQLService: GraphqlService
  ) {}

  getRecipeList(): Observable<any> {
    return this.graphQLService.getRecipeList();
  }

  getRecipeEditList(): Observable<any> {
    return this.graphQLService.getRecipeEditList();
  }

  getRecipe(recipeId: string): Observable<any> {
    return this.graphQLService.getRecipe(recipeId);
  }

  submitRecipeForApproval(recipe: IRecipe): Observable<any> {
    return this.graphQLService.submitForApproval(recipe);
  }

  addRecipe(recipe: IRecipe, approvalId: string): Observable<any> {
    return this.graphQLService.approveRecipe(approvalId, recipe);
  }

  updateRecipe(recipe: IRecipe): Observable<any> {
    return this.graphQLService.updateRecipe(recipe);
  }

  deleteRecipe(recipeId: string): Observable<any> {
    return this.graphQLService.deleteRecipe(recipeId);
  }

  rejectRecipe(recipeId: string): Observable<any> {
    return this.graphQLService.rejectRecipe(recipeId);
  }

  favoriteRecipe(recipe: IRecipe): Observable<any> {
    return this.graphQLService.favoriteRecipe(recipe._id, recipe.favoriters);
  }

  rateRecipe(recipe: IRecipe): Observable<any> {
    const ratersKeys = Object.keys(recipe.raters).map(String);
    const ratersValues = Object.values(recipe.raters).map(Number);
    return this.graphQLService.rateRecipe(recipe._id, ratersKeys, ratersValues);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
