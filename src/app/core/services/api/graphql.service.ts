import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IRecipe } from '../../../models/recipe.model';
import { environment } from 'src/environments/environment';

@Injectable(
  // { providedIn: 'root' }
)
export class GraphqlService {
  private uri = environment.path;

  constructor(private httpClient: HttpClient) { }

  getRecipeList(): Observable<any> {
    const query = '{recipes{_id,title,producer,favoriters,imgDir,nutritionValues{calories},raters{keys,values}}}';
    return this.httpClient.get(`${this.uri}recipes?query=${query}`, {responseType: 'json'});
  }

  getRecipeEditList(): Observable<any> {
    const query = '{recipes{_id,title}}';
    return this.httpClient.get(`${this.uri}recipes?query=${query}`, {responseType: 'json'});
  }

  getApprovalList(): Observable<any> {
    const query = '{recipes{_id,title}}';
    return this.httpClient.get(`${this.uri}admin/approval?query=${query}`, {responseType: 'json'});
  }

  getUserList(): Observable<any> {
    const query = '{users{_id,username,isAdmin}}';
    return this.httpClient.get(`${this.uri}admin/getUsers?query=${query}`, {responseType: 'json'});
  }
}
