import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

// import { AdminModule } from '../../admin/admin.module';
import { IUser } from '../../models/user.model';
import { IRecipe } from '../../models/recipe.model';
import { environment } from 'src/environments/environment';
import { GraphqlService } from '../../core/services/api/graphql.service';

@Injectable(
   // { providedIn: AdminModule }
  )
export class AdminService {
  private uri = environment.path + 'admin';

  constructor(private httpClient: HttpClient, private graphQLService: GraphqlService) { }

  getUsers(): Observable<any>  {
    return this.graphQLService.getUserList();
    // return this.httpClient.get<IUser[]>(`${this.uri}/getUsers`, {responseType: 'json'});
  }

  updateUsers(users: IUser[]): Observable<any> {
    return this.httpClient.post(`${this.uri}/updateUsers`, users, {responseType: 'text'});
  }

  getApprovalList(): Observable<any> {
    // return this.httpClient.get<IRecipe[]>(`${this.uri}/approval`, {responseType: 'json'});
    return this.graphQLService.getApprovalList();
  }

  getApprovalById(id: number): Observable<IRecipe> {
    return this.httpClient.get<IRecipe>(`${this.uri}/approval/${id}`, {responseType: 'json'});
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}
