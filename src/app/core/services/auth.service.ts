import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IUser, IUserResolved } from '../../models/user.model';
import { environment } from 'src/environments/environment';
import { GraphqlService } from './api/graphql.service';

@Injectable()
// { providedIn: 'root' }
export class AuthService {
  private uri = environment.path + 'auth';

  constructor(
    private httpClient: HttpClient,
    private gqlService: GraphqlService
  ) {}

  signUp(newUser: IUser): Observable<any> {
    return this.gqlService.signUp(newUser.username, newUser.password);
    // .pipe(catchError(this.handleError('signUp')));
  }

  signIn(userInfo: IUser): Observable<any> {
    return this.gqlService.signIn(userInfo.username, userInfo.password);
    // .pipe(catchError(this.handleError('signIn')));
  }

  signOut(): Observable<any> {
    return this.gqlService.signOut();
    // .pipe(catchError(this.handleError('signOut')));
    // return this.httpClient.get(`${this.uri}/signOut`, {responseType: 'text'});
  }

  // TODO: handle getUserData using graphql
  getUserData(): Observable<IUser> {
    return this.gqlService.getUserData();
    // return this.httpClient.get<IUserResolved>(`${this.uri}/getUserData`, {
    // responseType: 'json',
    // });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
