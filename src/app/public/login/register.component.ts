import { SessionService } from '../../core/services/session.service';
import { Component, OnInit, Inject } from '@angular/core';
import { IUser } from '../../models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { TOASTR_TOKEN, Toastr } from '../../core/services/toastr.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  userInfo: IUser;
  confirmPassword: string;
  passwordMessage: string;
  message: string;
  submitted = false;

  constructor(
    private auth: AuthService,
    @Inject(TOASTR_TOKEN) private toastr: Toastr,
    private router: Router,
    private sessionService: SessionService) { }

  ngOnInit() {
    this.userInfo = {
      username: '',
      password:  '',
      isAdmin: false,
      _id: 0
    };
  }

  register() {
    if (this.userInfo.password !== this.confirmPassword) {
      this.passwordMessage = 'Passwords do not match.';
      this.message = '';
      return;
    } else {
      this.passwordMessage = '';
      this.auth.signUp(this.userInfo).subscribe(res => {
        let tempRes: any;
        tempRes = res;
        this.submitted = true;

        if (!res) {
          console.error('Error creating new user');
        } else {
          this.sessionService.setUser(res.user as IUser);
          localStorage.setItem('token', tempRes.token);
          this.toastr.success('Profile Successfully Created');
          this.router.navigate(['home']);
        }
      },
      err => {
        console.error('Err: ' + JSON.stringify(err));
        this.message = err.error.ErrMessage;
        this.toastr.error(err.error.ErrMessage);
      });
    }

  }

  clearMessage(): void {
    this.message = '';
    this.passwordMessage = '';
  }

}
