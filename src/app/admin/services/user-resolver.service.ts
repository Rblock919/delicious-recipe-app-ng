import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IUserResolved, IUsersResolved } from '../../models/user.model';
import { AdminService } from 'src/app/admin/services/admin.service';

@Injectable(
  // { providedIn: 'root' }
)
export class UserResolverService implements Resolve<IUsersResolved> {

  constructor(private adminService: AdminService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUsersResolved> |
    Promise<IUsersResolved> | IUsersResolved {
    console.log('in user resolver');
    const multiple = route.data.multipleUsers;

    // if (multiple) { // implement once a need for fetching a single user is needed inside the interface and not just refreshing userdata
    if (true) {
      return this.adminService.getUsers()
        .pipe(map(graphQLRes => ({users: graphQLRes.data.users})),
          catchError(error => {
            console.error(error);
            return of ({users: null, error});
          })
        );
      // return this.adminService.getUsers()
      //   .pipe(map(users => ({users})),
      //   catchError(error => {
      //     console.error(error);
      //     return of ({users: null, error});
      //   })
      // );
    } else {
      // to-do: fetch a single user
    }

  }

}
