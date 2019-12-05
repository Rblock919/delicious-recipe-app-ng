import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';

import { AdminService } from 'src/app/admin/services/admin.service';
import { IUser, IUsersResolved } from 'src/app/models/user.model';
import { TOASTR_TOKEN, Toastr } from '../../core/services/toastr.service';

@Component({
  selector: 'app-edit-user-list',
  templateUrl: './edit-user-list.component.html',
  styleUrls: ['./edit-user-list.component.scss']
})
export class EditUserListComponent implements OnInit {

  userList: IUser[];
  updatedUserList: IUser[];
  editedAdminFields: boolean[];
  differentFromOriginal = false;

  constructor(private adminService: AdminService,
              private route: ActivatedRoute,
              private router: Router,
              @Inject(TOASTR_TOKEN) private toastr: Toastr
              ) { }

  ngOnInit() {
    this.editedAdminFields = [];
    this.userList = [];
    const resolvedData = this.route.snapshot.data.resolvedData as IUsersResolved;

    if (resolvedData.error) {
      console.error(`Error: ${resolvedData.error}`);
      this.router.navigate(['error']);
    } else {
      this.userList = resolvedData.users;
      let counter = 0;
      this.userList.forEach(user => {
        this.editedAdminFields.push();
        this.editedAdminFields[counter] = user.isAdmin;
        counter++;
      });
    }

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
    let counter = 0;
    let counter2 = 0;

    this.userList.forEach(user => {
      if (user.isAdmin !== this.editedAdminFields[counter]) {
        this.updatedUserList.push(user);
        this.updatedUserList[counter2].isAdmin = this.editedAdminFields[counter];
        counter2++;
      }
      counter++;
    });

    this.adminService.updateUsers(this.updatedUserList).subscribe(res => {
      console.log('res: ' + res);
      this.toastr.success('Users Successfully Updated!');
      this.differentFromOriginal = false;
      let counter3 = 0;
      this.editedAdminFields = [];
      this.userList.forEach(user => {
        this.editedAdminFields.push();
        this.editedAdminFields[counter3] = user.isAdmin;
        counter3++;
      });
    }, err => {
      console.log('err: ' + JSON.stringify(err));
      this.toastr.error('Error Updating Users');
    });
    console.log('submitted userList: ' + JSON.stringify(this.updatedUserList));
  }

}
