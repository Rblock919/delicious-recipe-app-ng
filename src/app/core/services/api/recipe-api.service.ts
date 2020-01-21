import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IRecipe } from '../../../models/recipe.model';
import { environment } from 'src/environments/environment';
import { GraphqlService } from './graphql.service';

@Injectable(
  // { providedIn: 'root' }
)
export class RecipeApiService {
  private uri = environment.path + 'recipes';

  constructor(private httpClient: HttpClient, private graphQLService: GraphqlService) { }

  getRecipeList(): Observable<any> {
    return this.graphQLService.getRecipeList();
    // .pipe(catchError(this.handleError<IRecipe[]>('getRecipeList', [])));
  }

  getRecipeEditList(): Observable<any> {
    return this.graphQLService.getRecipeEditList();
    // .pipe(catchError(this.handleError<IRecipe[]>('getRecipeEditList', [])));
  }

  getRecipe(recipeId: number): Observable<any> {
    return this.graphQLService.getRecipe(`${recipeId}`);
    // return this.httpClient.get<IRecipe>(`${this.uri}/${recipeId}`, {responseType: 'json'});
    // .pipe(catchError(this.handleError<IRecipe>('getRecipe')));
  }

  submitRecipeForApproval(recipe: IRecipe): Observable<any> {
    // const data = {recipe};
    // return this.httpClient.post(`${this.uri}/submit`, data, {responseType: 'text'});
    return this.graphQLService.submitForApproval(recipe);
  }

  addRecipe(recipe: IRecipe, approvalId: number): Observable<any> {
    return this.graphQLService.approveRecipe(`${approvalId}`, recipe);
    // return this.httpClient.post(`${this.uri}/add`, data, {responseType: 'json'});
  }

  updateRecipe(recipe: IRecipe): Observable<any> {
    const data = {recipe};
    return this.httpClient.patch(`${this.uri}/update`, data, {responseType: 'text'});
  }

  deleteRecipe(recipeId: number): Observable<any> {
    return this.httpClient.delete(`${this.uri}/delete/${recipeId}`, {responseType: 'text'});
  }

  rejectRecipe(recipeId: number): Observable<any> {
    // return this.httpClient.delete(`${this.uri}/reject/${recipeId}`, {responseType: 'text'});
    return this.graphQLService.rejectRecipe(`${recipeId}`);
  }

  favoriteRecipe(recipe: IRecipe): Observable<any> {
    return this.graphQLService.favoriteRecipe(`${recipe._id}`, recipe.favoriters);
  }

  rateRecipe(recipe: IRecipe): Observable<any> {
    const ratersKeys = Object.keys(recipe.raters).map(String);
    const ratersValues = Object.values(recipe.raters).map(String);
    return this.graphQLService.rateRecipe(`${recipe._id}`, ratersKeys, ratersValues);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}
