import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoggerService } from '../../core/services/logger.service';
import { IRecipe, IRecipesResolved } from 'src/app/models/recipe.model';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-approve-recipe-list',
  templateUrl: './approve-recipe-list.component.html',
  styleUrls: ['./approve-recipe-list.component.scss']
})
export class ApproveRecipeListComponent implements OnInit, OnDestroy {

  private recipeSub: Subscription;

  recipeList: IRecipe[];

  constructor(private loggerService: LoggerService,
              private adminService: AdminService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // const resolvedData: IRecipesResolved = this.route.snapshot.data.resolvedData;
    //
    // if (resolvedData.error) {
    //   this.loggerService.consoleError(resolvedData.error);
    //   this.router.navigate(['error']);
    // } else {
    //   this.recipeList = resolvedData.recipes;
    // }
    this.recipeSub = this.adminService.getApprovalList().subscribe(result => {
      const tmp = result.data as any;
      console.log(`result: ${JSON.stringify(result)}`);
      this.recipeList = tmp.unapprovedRecipes;
    }, err => {
      console.log(`err: ${err}`);
    });
  }

  ngOnDestroy(): void {
    this.recipeSub.unsubscribe();
  }

}
