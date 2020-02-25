import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoggerService } from '../../core/services/logger.service';
import { IRecipe } from 'src/app/models/recipe.model';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-approve-recipe-list',
  templateUrl: './approve-recipe-list.component.html',
  styleUrls: ['./approve-recipe-list.component.scss'],
})
export class ApproveRecipeListComponent implements OnInit, OnDestroy {
  private recipeSub: Subscription;

  recipeList: IRecipe[];

  constructor(
    private loggerService: LoggerService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.recipeSub = this.adminService.getApprovalList().subscribe(
      result => {
        this.loggerService.consoleLog(`result: ${JSON.stringify(result)}`);
        this.recipeList = result;
      },
      err => {
        this.loggerService.consoleError(`err: ${err}`);
      }
    );
  }

  ngOnDestroy(): void {
    this.recipeSub.unsubscribe();
  }
}
