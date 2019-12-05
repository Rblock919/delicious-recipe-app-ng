import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/services/auth.service';
import { TOASTR_TOKEN, Toastr} from '../../core/services/toastr.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  searchString: string;

  constructor(
    public session: SessionService,
    @Inject(TOASTR_TOKEN) private toastr: Toastr,
    private auth: AuthService,
    private router: Router) {
  }

  ngOnInit() {
    this.searchString = '';
  }

  search(): void {
    if (this.searchString !== '') {
      console.log('user has actually entered something to search \nSearching...');
      this.router.navigate(['/recipe/search'], { queryParams: {searchString: this.searchString}});
    } else {
      console.log('nothing to search...');
    }
  }

  logout(): void {
    if (this.session.logout()) {
      if (this.session.isAdmin) {
        this.session.setAdminStatus(false);
      }
    }
    this.clearSearch();

    this.auth.signOut().subscribe(res => {
      this.toastr.success('You have successfully logged out');
      this.router.navigate(['logout']);
    }, err => {
      console.error('Error destroying session from backend');
      this.toastr.error('Error ending session with backend');
      this.router.navigate(['logout']);
      // TO-DO: implement logging out of front end and hiding error from user
    });
  }

  navigateHome(): void {
    this.clearSearch();
    if (this.session.getUser) {
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['index']);
    }
  }

  // For testing; remove eventually
  getUserData(): void {
    this.auth.getUserData().subscribe(res => {
      console.log('RES FROM GET USERDATA: ' + JSON.stringify(res));
    });
  }

  clearSearch(): void {
    this.searchString = '';
  }

}
