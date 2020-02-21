import {Component, Inject, OnDestroy, OnInit, SecurityContext} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {Subscription} from 'rxjs';

import {RecipeApiService} from 'src/app/core/services/api/recipe-api.service';
import {IRecipe, IRecipeResolved} from 'src/app/models/recipe.model';
import {SessionService} from '../../core/services/session.service';
import {Toastr, TOASTR_TOKEN} from 'src/app/core/services/toastr.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {

  recipe: IRecipe;
  recipeId: number;
  preCookTitle: string;
  favorited: boolean;
  rated: boolean;
  userRating = 0;
  avgRating = 0;
  recipeSub: Subscription;

  constructor(private recipeApi: RecipeApiService,
              private route: ActivatedRoute,
              private session: SessionService,
              private router: Router,
              private sanitizer: DomSanitizer,
              @Inject(TOASTR_TOKEN) private toastr: Toastr
              ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.recipeId = this.route.snapshot.params.id;
    this.recipeSub = this.recipeApi.getRecipe(this.recipeId).subscribe(result => {
      // console.log(`result: ${JSON.stringify(result)}`);
      this.recipe = result;
      this.recipeId = this.recipe._id;
      let favoriters: string[];
      favoriters = this.recipe.favoriters;
      this.favorited = favoriters.indexOf('' + this.session.getUser._id) > -1;
      if (this.recipe.producer === 'Hello Fresh') {
        this.preCookTitle = 'Bust Out:';
      } else if (this.recipe.producer === 'Home Chef') {
        this.preCookTitle = 'Before You Cook:';
      }

      const tmpMap = new Map<number, number>();

      let counter = 0;
      for (const key of result.raters.keys) {
        tmpMap[key] = result.raters.values[counter];
        counter++;
      }

      this.recipe.raters = tmpMap;

      if (Object.keys(this.recipe.raters).length > 0) {
        this.rated = !!(this.recipe.raters[this.session.getUser._id]);
        this.userRating = this.rated ? this.recipe.raters[this.session.getUser._id] : 0;

        let ratingCounter = 0;
        for (const value of Object.values(this.recipe.raters)) {
          this.avgRating += Number(value);
          ratingCounter++;
        }

        this.avgRating /= ratingCounter;
      }
    }, err => {
      console.log(`err: ${err}`);
    });

  }

  ngOnDestroy(): void {
    this.recipeSub.unsubscribe();
  }

  get userIsAdmin(): boolean {
    return this.session.isAdmin;
  }

  setRating(rating: number): void {
    this.userRating = rating;
  }

  logRate($event) {
    console.log($event);
  }

  submitRate() {
    this.recipe.raters[this.session.getUser._id] = this.userRating;

    this.recipeApi.rateRecipe(this.recipe).subscribe(res => {
      this.rated = true;
      this.toastr.success(`${this.sanitizer.sanitize(SecurityContext.HTML, this.recipe.title)} Successfully Rated!`);

      // update average rating
      let ratingCounter = 0;
      this.avgRating = 0;
      for (const value of Object.values(this.recipe.raters)) {
        this.avgRating += Number(value);
        ratingCounter++;
      }
      this.avgRating /= ratingCounter;

    }, err => {
      this.toastr.error(`ERROR RATING RECIPE`);
      console.log('err in submitRate: ' + err);
    });
  }

  favorite(): void {
    this.favorited = !this.favorited;
    if (this.favorited) {
      this.recipe.favoriters.push('' + this.session.getUser._id);
    } else {
      this.recipe.favoriters = this.recipe.favoriters.filter(uId => uId !== '' + this.session.getUser._id);
    }

    console.log(`this.recipe: ${JSON.stringify(this.recipe)}`);

    this.recipeApi.favoriteRecipe(this.recipe).subscribe(result => {
      // console.log('res from fav api call: ' + res);
      if (this.favorited) {
        this.toastr.success(`${this.sanitizer.sanitize(SecurityContext.HTML, this.recipe.title)} Has Been Favorited`);
      } else {
        this.toastr.success(`${this.sanitizer.sanitize(SecurityContext.HTML, this.recipe.title)} Has Been Unfavorited`);
      }
    }, err => {
      console.log(`err: ${err}`);
    });
  }

}



