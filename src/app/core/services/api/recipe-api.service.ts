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
    // return this.httpClient.get<IRecipe[]>(`${this.uri}`, {responseType: 'json'});
    return this.graphQLService.getRecipeList();
    // .pipe(catchError(this.handleError<IRecipe[]>('getRecipeList', [])));
  }

  getRecipeEditList(): Observable<any> {
    return this.graphQLService.getRecipeEditList();
  }

  getRecipe(recipeId: number): Observable<IRecipe> {
    return this.httpClient.get<IRecipe>(`${this.uri}/${recipeId}`, {responseType: 'json'});
    // .pipe(catchError(this.handleError<IRecipe>('getRecipe')));
  }

  submitRecipeForApproval(recipe: IRecipe): Observable<any> {
    const data = {recipe};
    return this.httpClient.post(`${this.uri}/submit`, data, {responseType: 'text'});
  }

  addRecipe(recipe: IRecipe, approvalId: number): Observable<any> {
    const data = {
      recipe,
      approvalId
    };
    return this.httpClient.post(`${this.uri}/add`, data, {responseType: 'json'});
  }

  updateRecipe(recipe: IRecipe): Observable<any> {
    const data = {recipe};
    return this.httpClient.patch(`${this.uri}/update`, data, {responseType: 'text'});
  }

  deleteRecipe(recipeId: number): Observable<any> {
    return this.httpClient.delete(`${this.uri}/delete/${recipeId}`, {responseType: 'text'});
  }

  rejectRecipe(recipeId: number): Observable<any> {
    return this.httpClient.delete(`${this.uri}/reject/${recipeId}`, {responseType: 'text'});
  }

  favoriteRecipe(recipe: IRecipe): Observable<any> {
    return this.httpClient.post(`${this.uri}/favorite`, recipe, {responseType: 'text'});
  }

  rateRecipe(recipe: IRecipe): Observable<any> {
    return this.httpClient.post(`${this.uri}/rate`, recipe, {responseType: 'text'});
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}
