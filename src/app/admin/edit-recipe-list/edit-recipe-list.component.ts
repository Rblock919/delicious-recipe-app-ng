import { ActivatedRoute } from '@angular/router';
import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';

import { IRecipe, IRecipesResolved, IRecipesGQLResolved } from 'src/app/models/recipe.model';
import { RecipeApiService } from 'src/app/core/services/api/recipe-api.service';
import { TOASTR_TOKEN, Toastr } from 'src/app/core/services/toastr.service';
import { JQ_TOKEN } from '../../core/services/jQuery.service';

@Component({
  selector: 'app-edit-recipe-list',
  templateUrl: './edit-recipe-list.component.html',
  styleUrls: ['./edit-recipe-list.component.scss']
})
export class EditRecipeListComponent implements OnInit, OnDestroy {

  private recipeSub: Subscription;

  recipeList: IRecipe[];
  selectedRecipe: IRecipe;
  selectedRecipeTitle = '';

  constructor(private apiService: RecipeApiService,
              private route: ActivatedRoute,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
              @Inject(JQ_TOKEN) private $: any
              ) { }

  ngOnInit() {
    this.recipeList = [];
    // const resolvedData = this.route.snapshot.data.resolvedData as IRecipesGQLResolved;
    //
    // if (resolvedData.error) {
    //   console.error(`Error in edit recipe list component: ${resolvedData.error}`);
    // } else {
    //   for (const recipe of resolvedData.recipes) {
    //     let tmpRecipe: IRecipe;
    //     tmpRecipe = {
    //       _id: recipe._id,
    //       title: recipe.title
    //     };
    //     this.recipeList.push(tmpRecipe);
    //   }
    //   // this.recipeList = resolvedData.recipes;
    // }
    this.recipeSub = this.apiService.getRecipeEditList().subscribe(result => {
      const tmp = result.data as any;
      this.recipeList = tmp.recipes;
    }, err => {
      console.log(`err: ${err}`);
    });
  }

  ngOnDestroy(): void {
    this.recipeSub.unsubscribe();
  }

  triggerModal(recipe: IRecipe): void {
    this.selectedRecipe = recipe;
    this.selectedRecipeTitle = recipe.title;
  }

  deleteRecipe(recipeId: number): void {
    this.apiService.deleteRecipe(recipeId).subscribe(res => {
      console.log('Res: ' + res);
      this.recipeList = this.recipeList.filter(x => x._id !== recipeId);
      this.toastr.success('Recipe Successfully Deleted');
    }, err => {
      console.error(err);
      this.toastr.error('Error Deleting Recipe');
    });
  }

}
