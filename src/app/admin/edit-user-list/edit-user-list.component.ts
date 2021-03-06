import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AdminService } from 'src/app/admin/services/admin.service';
import { IUser, IUsersResolved } from 'src/app/models/user.model';
import { TOASTR_TOKEN, Toastr } from '../../core/services/toastr.service';

@Component({
  selector: 'app-edit-user-list',
  templateUrl: './edit-user-list.component.html',
  styleUrls: ['./edit-user-list.component.scss'],
})
export class EditUserListComponent implements OnInit, OnDestroy {
  private userSub: Subscription;

  userList: IUser[];
  updatedUserList: { userId: string; isAdmin: boolean }[];
  editedAdminFields: boolean[];
  differentFromOriginal = false;

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: Toastr
  ) {}

  ngOnInit() {
    this.editedAdminFields = [];
    this.userList = [];

    this.userSub = this.adminService.getUsers().subscribe(
      result => {
        this.userList = result;
        let counter = 0;
        this.userList.forEach(user => {
          this.editedAdminFields.push();
          this.editedAdminFields[counter] = user.isAdmin;
          counter++;
        });
      },
      err => {
        console.log(`err: ${err}`);
      }
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  changeStatus(user: IUser): void {
    const index = this.userList.indexOf(user);
    this.editedAdminFields[index] = !this.editedAdminFields[index];
    this.calcDiff();
  }

  calcDiff(): void {
    this.differentFromOriginal = false;
    let counter = 0;
    while (counter < this.userList.length) {
      if (this.editedAdminFields[counter] !== this.userList[counter].isAdmin) {
        this.differentFromOriginal = true;
      }
      counter++;
    }
  }

  submit(): void {
    this.updatedUserList = [];
    // let counter = 0;

    // TODO: improve logic with maps or reducers
    this.userList.forEach((user, index) => {
      if (user.isAdmin !== this.editedAdminFields[index]) {
        this.updatedUserList.push({
          userId: user._id,
          isAdmin: this.editedAdminFields[index],
        });
      }
      // counter++;
    });

    this.adminService.updateUsers(this.updatedUserList).subscribe(
      res => {
        console.log('res: ' + JSON.stringify(res));
        this.toastr.success('Users Successfully Updated!');
        this.differentFromOriginal = false;
        let counter3 = 0;
        this.editedAdminFields = [];
        this.userList.forEach(user => {
          this.editedAdminFields.push();
          this.editedAdminFields[counter3] = user.isAdmin;
          counter3++;
        });
      },
      err => {
        console.log('err: ' + JSON.stringify(err));
        this.toastr.error('Error Updating Users');
      }
    );
  }
}
