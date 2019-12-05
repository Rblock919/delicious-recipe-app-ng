import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { templateSourceUrl } from '@angular/compiler';

import { IUser, IUserResolved } from '../../models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private uri = environment.path + 'auth';

  constructor(private httpClient: HttpClient) { }

  signUp(newUser: IUser): Observable<any> {
    // const options = { headers: new HttpHeaders( { 'Content-Type': '/application/json'} )};
    return this.httpClient.post(`${this.uri}/signUp`, newUser, {responseType: 'json'});
    // .pipe(catchError(this.handleError('signUp')));
  }

  signIn(userInfo: IUser): Observable<any> {
    return this.httpClient.post(`${this.uri}/signIn`, userInfo, {responseType: 'json'});
    // .pipe(catchError(this.handleError('signIn')));
  }

  signOut(): Observable<any> {
    return this.httpClient.get(`${this.uri}/signOut`, {responseType: 'text'});
  }

  getUserData(): Observable<IUserResolved> {
    return this.httpClient.get<IUserResolved>(`${this.uri}/getUserData`, {responseType: 'json'});
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
