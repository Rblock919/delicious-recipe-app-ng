import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { IUser } from '../../models/user.model';
import { GraphqlService } from '../../core/services/api/graphql.service';

@Injectable()
// { providedIn: AdminModule }
export class AdminService {
  constructor(
    private httpClient: HttpClient,
    private graphQLService: GraphqlService
  ) {}

  getUsers(): Observable<any> {
    return this.graphQLService.getUserList();
  }

  updateUsers(users: { userId: string; isAdmin: boolean }[]): Observable<any> {
    return this.graphQLService.updateUsers(users);
  }

  getApprovalList(): Observable<any> {
    return this.graphQLService.getApprovalList();
  }

  getApprovalById(id: string): Observable<any> {
    return this.graphQLService.getApprovalById(id);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
