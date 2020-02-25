import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { IUser } from '../../models/user.model';
import { TOASTR_TOKEN, Toastr } from '../../core/services/toastr.service';
import { SessionService } from '../../core/services/session.service';
import { GraphqlService } from '../../core/services/api/graphql.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userInfo: IUser;
  message: string;

  constructor(
    private authService: AuthService,
    private gqlService: GraphqlService,
    @Inject(TOASTR_TOKEN) private toastr: Toastr,
    private sessionService: SessionService,
    private router: Router) { }

  ngOnInit() {
    this.userInfo = {
      username: '',
      password: '',
      isAdmin: false,
      _id: '0'
    };
  }

  login() {
    console.log('Logging in..');
    this.authService.signIn(this.userInfo).subscribe(result => {
      // console.log('Response Token: ' + result.token);
      localStorage.setItem('token', result.token);
      const user: IUser = {
        _id: result.user._id,
        username: result.user.username,
        isAdmin: result.user.isAdmin
      };
      this.sessionService.setUser(user);
      this.toastr.success('Successfully Logged In');
      if (this.sessionService.getRedirectUrl) {
        this.router.navigate([this.sessionService.getRedirectUrl]);
      } else {
        this.router.navigate(['home']);
      }
    }, err => {
      // TODO: handle graphql errors like wrong username and/or password
      this.message = err;
      console.log(`err: ${err}`);
    });
  }

  clearMessage(): void {
    this.message = '';
  }

}
