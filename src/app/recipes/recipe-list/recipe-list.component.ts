import { ActivatedRoute, Router } from '@angular/router';
import {Component, Inject, OnDestroy, OnInit, SecurityContext} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import {
  IRecipe,
  IRecipesResolved,
  IRecipeGQLResolved,
  IRecipesGQLResolved,
  IRecipeGQL
} from 'src/app/models/recipe.model';
import { SessionService } from '../../core/services/session.service';
import { Toastr, TOASTR_TOKEN } from '../../core/services/toastr.service';
import { RecipeApiService } from '../../core/services/api/recipe-api.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  private recipeSub: Subscription;

  recipeList: IRecipe[];

  sortFilter: string;
  sortDirection: string;

  topSelectedFilter = '';
  botSelectedFilter = '';

  userId: string;

  // For modal purposes
  selectedRecipe: IRecipe;
  rated: boolean;
  userRating = 0;

  constructor(private sessionService: SessionService,
              private apiService: RecipeApiService,
              private router: Router,
              private sanitizer: DomSanitizer,
              @Inject(TOASTR_TOKEN) private toastr: Toastr) { }

  ngOnInit() {
    window.scroll(0, 0);
    // const resolvedData: IRecipesResolved = this.route.snapshot.data.resolvedData;
    // const resolvedData = this.route.snapshot.data.resolvedData as IRecipesGQLResolved;
    //
    // if (resolvedData.error) {
    //   console.error(`Error from resolver: ${JSON.stringify(resolvedData.error)}`);
    //   this.router.navigate(['error']);
    // } else {
    //   this.recipeList = [];
    //   // console.log(`resolvedData: ${JSON.stringify(resolvedData.recipes)}`);
    //
    //   // have to loop through graphQL responses and reverse engineer maps since graphQL doesn't natively support maps
    //   for (const recipe of resolvedData.recipes) {
    //     let tmpRecipe: IRecipe;
    //     const tmpMap = new Map<number, number>();
    //
    //     let counter = 0;
    //     for (const key of recipe.raters.keys) {
    //       tmpMap[key] = recipe.raters.values[counter];
    //       counter++;
    //     }
    //
    //     tmpRecipe = {
    //       _id: recipe._id,
    //       title: recipe.title,
    //       producer: recipe.producer,
    //       nutritionValues: {
    //         calories: recipe.nutritionValues.calories
    //       },
    //       favoriters: recipe.favoriters,
    //       raters: tmpMap,
    //       imgDir: recipe.imgDir
    //     };
    //     this.recipeList.push(tmpRecipe);
    //   }
    //   // this.recipeList = resolvedData.recipes;
    //   this.userId = this.sessionService.getUser._id;
    //
    //   // just temporarily assign it to 1st recipe to avoid errors
    //   this.selectedRecipe = this.recipeList[0];
    // }

    this.recipeSub = this.apiService.getRecipeList().subscribe(result => {
      // console.log(`RESULT: ${JSON.stringify(result)}`);
      this.recipeList = [];

      // have to loop through graphQL responses and reverse engineer maps since graphQL doesn't natively support maps
      for (const recipe of result) {
        let tmpRecipe: IRecipe;
        const tmpMap = new Map<string, number>();

        let counter = 0;
        for (const key of recipe.raters.keys) {
          tmpMap[key] = recipe.raters.values[counter];
          counter++;
        }

        tmpRecipe = {
          _id: recipe._id,
          title: recipe.title,
          producer: recipe.producer,
          nutritionValues: {
            calories: recipe.nutritionValues.calories
          },
          favoriters: recipe.favoriters,
          raters: tmpMap,
          imgDir: recipe.imgDir
        };
        this.recipeList.push(tmpRecipe);
      }
      // this.recipeList = resolvedData.recipes;
      this.userId = this.sessionService.getUser._id;

      // just temporarily assign it to 1st recipe to avoid errors
      this.selectedRecipe = this.recipeList[0];
    }, err => {
      console.log(`err: ${err}`);
    });

  }

  ngOnDestroy(): void {
    this.recipeSub.unsubscribe();
  }

  setSortFilter(input: string): void {
    if (this.sortFilter === input) {

      if (this.sortDirection === 'down') {
        this.sortFilter = this.sortDirection = '';
      } else {
        this.sortDirection = 'down';
      }

    } else {
      this.sortFilter = input;
      this.sortDirection = 'up';
    }

  }

  setBotFilter(input: string): void {
    this.botSelectedFilter = this.botSelectedFilter === input ? '' : input;
  }

  setTopFilter(input: string): void {
    this.topSelectedFilter = this.topSelectedFilter === input ? '' : input;
  }

  // test after implementing GraphQL
  favEvent($event): void {
    const recipeToFav = $event.recipe as IRecipe;
    const favoriting = $event.favoriting as boolean;

    this.apiService.favoriteRecipe(recipeToFav).subscribe((res) => {
      if (favoriting) {
        const message = `${recipeToFav.title} Has Been Favorited!`;
        this.toastr.success(this.sanitizer.sanitize(SecurityContext.HTML, message));
      } else {
        const message = `${recipeToFav.title} Has Been Unfavorited!`;
        this.toastr.success(this.sanitizer.sanitize(SecurityContext.HTML, message));
      }
      this.recipeList = this.recipeList.slice(0); // re-trigger pipes
    }, (err) => {
      console.error(`err: ${err}`);
      this.toastr.error('Error favoriting recipe');
    });

  }

  triggerRate($event): void {
    this.selectedRecipe = $event as IRecipe;
    this.rated = !!this.selectedRecipe.raters[this.userId];
    this.userRating = this.rated ? this.selectedRecipe.raters[this.userId] : 0;
  }

  setRating(rating: number): void {
    this.userRating = rating;
  }

  submitRate(): void {
    this.selectedRecipe.raters[this.userId] = this.userRating;

    this.apiService.rateRecipe(this.selectedRecipe).subscribe((res) => {
      const idx = this.recipeList.indexOf(this.selectedRecipe);
      // update the userRating to re-trigger the input method in the recipe component to update the UI rate
      this.recipeList[idx].raters[this.userId] = this.userRating;
      this.toastr.success(this.sanitizer.sanitize(SecurityContext.HTML, `${this.selectedRecipe.title} has been successfully rated`));
    }, (err) => {
      console.log(`err: ${err}`);
      this.toastr.error('Error rating recipe');
    });
  }

}