import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { LoggerService } from '../../core/services/logger.service';
import { IRecipe, IRecipesResolved } from 'src/app/models/recipe.model';

@Component({
  selector: 'app-approve-recipe-list',
  templateUrl: './approve-recipe-list.component.html',
  styleUrls: ['./approve-recipe-list.component.scss']
})
export class ApproveRecipeListComponent implements OnInit {

  recipeList: IRecipe[];

  constructor(private loggerService: LoggerService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const resolvedData: IRecipesResolved = this.route.snapshot.data.resolvedData;

    if (resolvedData.error) {
      this.loggerService.consoleError(resolvedData.error);
      this.router.navigate(['error']);
    } else {
      this.recipeList = resolvedData.recipes;
    }
  }

}
