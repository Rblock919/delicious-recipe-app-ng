import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../models/user.model';
import { Observable } from 'rxjs';

@Injectable(
  // { providedIn: 'root' }
)
export class SessionService {

  private admin = false;
  userData: IUser;
  private redirectUrl: string;

  constructor() { }

  logout() {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      this.userData = null;
      return true;
    } else {
      return false;
    }
  }

  get getRedirectUrl(): string {
    return this.redirectUrl;
  }

  set setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  setUser(user: IUser) {
    this.userData = user;
    this.setAdminStatus(user.isAdmin);
  }

  get getUser(): IUser {
    return this.userData;
  }

  setAdminStatus(isAdmin: boolean): void {
    this.admin = isAdmin;
  }

  get isAdmin() {
    if (this.userData) {
      return this.userData.isAdmin;
    } else {
      return this.admin;
    }
  }

  get token() {
    return localStorage.getItem('token');
  }

  get isAuthenticated() {
    return !!localStorage.getItem('token');
  }

}
