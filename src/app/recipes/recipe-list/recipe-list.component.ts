import {ActivatedRoute, Router} from '@angular/router';
import {Component, Inject, OnInit, SecurityContext} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {IRecipe, IRecipesResolved} from 'src/app/models/recipe.model';
import {SessionService} from '../../services/session.service';
import {Toastr, TOASTR_TOKEN} from '../../shared/toastr.service';
import {RecipeApiService} from '../../services/api/recipe-api.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {

  recipeList: IRecipe[];

  // For modal purposes
  selectedRecipe: IRecipe;
  rated: boolean;
  userRating = 0;

  sortFilter: string;
  sortDirection: string;

  topSelectedFilter = '';
  botSelectedFilter = '';

  userId: number;

  constructor(private sessionService: SessionService,
              private apiService: RecipeApiService,
              private route: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer,
              @Inject(TOASTR_TOKEN) private toastr: Toastr) { }

  ngOnInit() {
    window.scroll(0, 0);
    const resolvedData: IRecipesResolved = this.route.snapshot.data.resolvedData;

    if (resolvedData.error) {
      console.error(`Error from resolver: ${JSON.stringify(resolvedData.error)}`);
      this.router.navigate(['error'])
        .then(r => console.log('Routed away from recipe list due to error'));
    } else {
      this.recipeList = resolvedData.recipes;
      this.userId = this.sessionService.getUser._id;

      // just temporarily assign it to 1st recipe to avoid errors
      this.selectedRecipe = this.recipeList[0];
    }

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
    // this.userRating = !!this.selectedRecipe.raters[this.userId] ? this.selectedRecipe.raters[this.userId] : 0;
    this.rated = !!this.selectedRecipe.raters[this.userId];
    this.userRating = this.rated ? this.selectedRecipe.raters[this.userId] : 0;
  }

  setRating(rating: number): void {
    this.userRating = rating;
  }

  submitRate(): void {
    this.selectedRecipe.raters[this.userId] = this.userRating;
    this.apiService.rateRecipe(this.selectedRecipe).subscribe((res) => {
      console.log(`res: ${res}`);
      const idx = this.recipeList.indexOf(this.selectedRecipe);
      this.recipeList[idx].raters[this.userId] = this.userRating;
      this.toastr.success(this.sanitizer.sanitize(SecurityContext.HTML, `${this.selectedRecipe.title} has been successfully rated`));
    }, (err) => {
      console.log(`err: ${err}`);
      this.toastr.error('Error rating recipe');
    });
  }

}
