import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IRecipeResolved, IRecipesResolved } from '../../models/recipe.model';
import { AdminService } from 'src/app/admin/services/admin.service';

@Injectable(
  // { providedIn: 'root' }
)
export class UnapprovedRecipeResolverService implements Resolve<IRecipeResolved | IRecipesResolved> {

  constructor(private adminService: AdminService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IRecipeResolved> | Promise<IRecipeResolved> |
  IRecipeResolved | Observable<IRecipesResolved>  | Promise<IRecipesResolved> | IRecipesResolved {

    const multiple = route.data.multipleRecipes;

    if (multiple) {
      return this.adminService.getApprovalList()
        .pipe(map(graphQLRes => ({recipes: graphQLRes.data.recipes})),
        catchError(error => {
          return of ({recipes: null, error});
        })
      );
    } else {
      const id = route.params.id;

      return this.adminService.getApprovalById(id)
        .pipe(map(recipe => ({recipe})),
        catchError(error => {
          return of ({recipe: null, error});
        })
      );
    }
  }

}
