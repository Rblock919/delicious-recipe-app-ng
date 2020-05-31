import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  SecurityContext,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { IRecipe, IRecipesGQLResolved } from 'src/app/models/recipe.model';
import { Toastr, TOASTR_TOKEN } from 'src/app/core/services/toastr.service';
import { SessionService } from 'src/app/core/services/session.service';
import { LoggerService } from '../../core/services/logger.service';
import { RecipeApiService } from '../../core/services/api/recipe-api.service';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.scss'],
})
export class RecipeSearchComponent implements OnInit, OnDestroy {
  searchString: string;

  private searchSub: Subscription;
  private recipeSub: Subscription;

  recipeList: IRecipe[];
  filteredList: IRecipe[];

  userId: string;

  // For modal purposes
  selectedRecipe: IRecipe;
  rated: boolean;
  userRating = 0;

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private loggerService: LoggerService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private apiService: RecipeApiService,
    @Inject(TOASTR_TOKEN) private toastr: Toastr
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    // const resolvedData: IRecipesResolved = this.route.snapshot.data.resolvedData;
    // const resolvedData = this.route.snapshot.data.resolvedData as IRecipesGQLResolved;
    //
    // if (resolvedData.error) {
    //   console.error(`Error in edit recipe ${resolvedData.error}`);
    //   this.toastr.error(`Error fetching recipes: ${resolvedData.error}`);
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
    //
    // }

    this.recipeSub = this.apiService.getRecipeList().subscribe(
      result => {
        this.recipeList = [];
        // console.log(`resolvedData: ${JSON.stringify(resolvedData.recipes)}`);

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
              calories: recipe.nutritionValues.calories,
            },
            favoriters: recipe.favoriters,
            raters: tmpMap,
            imgDir: recipe.imgDir,
          };
          this.recipeList.push(tmpRecipe);
        }
        // this.recipeList = resolvedData.recipes;
        this.userId = this.sessionService.getUser._id;

        // just temporarily assign it to 1st recipe to avoid errors
        this.selectedRecipe = this.recipeList[0];
        this.filterRecipes();
      },
      err => {
        console.error(`err: ${err}`);
        this.router.navigate(['error']);
      }
    );

    this.searchSub = this.route.queryParamMap.subscribe(params => {
      this.loggerService.consoleLog(
        `Param changed to: ${params.get('searchString')}`
      );
      this.searchString = params.get('searchString');
      if (!!this.recipeList) {
        this.filterRecipes();
      }
    });
  }

  filterRecipes(): void {
    this.filteredList = this.recipeList.filter(x =>
      x.title
        .toLocaleLowerCase()
        .includes(this.searchString.toLocaleLowerCase())
    );
  }

  ngOnDestroy() {
    this.searchSub.unsubscribe();
    this.recipeSub.unsubscribe();
  }

  favEvent($event): void {
    const recipeToFav = $event.recipe as IRecipe;
    const favoriting = $event.favoriting as boolean;

    this.apiService.favoriteRecipe(recipeToFav._id).subscribe(
      res => {
        if (favoriting) {
          const message = `${recipeToFav.title} Has Been Favorited!`;
          this.toastr.success(
            this.sanitizer.sanitize(SecurityContext.HTML, message)
          );
        } else {
          const message = `${recipeToFav.title} Has Been Unfavorited!`;
          this.toastr.success(
            this.sanitizer.sanitize(SecurityContext.HTML, message)
          );
        }
        this.recipeList = this.recipeList.slice(0); // re-trigger pipes
      },
      err => {
        console.error(`err: ${err}`);
        this.toastr.error('Error favoriting recipe');
      }
    );
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

    this.apiService
      .rateRecipe(this.selectedRecipe._id, this.userRating)
      .subscribe(
        res => {
          console.log(`res: ${res}`);
          const idx = this.recipeList.indexOf(this.selectedRecipe);
          this.recipeList[idx].raters[this.userId] = this.userRating;
          this.toastr.success(
            this.sanitizer.sanitize(
              SecurityContext.HTML,
              `${this.selectedRecipe.title} has been successfully rated`
            )
          );
        },
        err => {
          console.log(`err: ${err}`);
          this.toastr.error('Error rating recipe');
        }
      );
  }
}
