import {
  Component,
  OnInit,
  Input,
  Inject,
  EventEmitter,
  Output
} from '@angular/core';

import { JQ_TOKEN } from '../../core/services/jQuery.service';
import { IRecipe } from 'src/app/models/recipe.model';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {
  private _userRating = 0;
  rated = false;

  @Input()
  recipe: IRecipe;
  @Input()
  userId: number;
  @Input()
  set userRating(rating: number) {
    this._userRating = !!rating ? rating : 0;
    this.rated = this._userRating > 0;

    // compute/update average rating
    if (Object.keys(this.recipe.raters).length > 0) {
      let ratingCounter = 0;
      this.avgRating = 0;
      for (const value of Object.values(this.recipe.raters)) {
        this.avgRating += Number(value);
        ratingCounter++;
      }
      this.avgRating /= ratingCounter;
    }

    // console.log(`(2) user rating for ${this.recipe.title} is ${this._userRating}`);
    // this._userRating = rating;
  }
  get userRating(): number {
    return this._userRating;
  }
  @Output()
  favoriteEvent = new EventEmitter();
  @Output()
  rateEvent = new EventEmitter();

  favorited = false;
  avgRating = 0;

  // modalContentID: string;

  constructor(
    // @Inject(JQ_TOKEN) private $: any
  ) { }

  ngOnInit() {
    let favoritersList: string[];
    favoritersList = this.recipe.favoriters;
    this.favorited = favoritersList.indexOf('' + this.userId) > -1;
    // this.modalContentID = this.makeModalId(20);
    // console.log('MODAL CONTENT ID: ' + this.modalContentID);

    // if (Object.keys(this.recipe.raters).length > 0) {
    //
    //   if (this.recipe.raters[this.userId]) {
    //     this.rated = true;
    //     this.userRating = this.recipe.raters[this.userId];
    //   }
    //
    //   let ratingCounter = 0;
    //   for (const value of Object.values(this.recipe.raters)) {
    //     this.avgRating += Number(value);
    //     ratingCounter++;
    //   }
    //
    //   this.avgRating /= ratingCounter;
    //
    // }

  }

  makeModalId(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

  // ngAfterViewInit() {
    // const modalButton = '#' + this.recipe._id;
    // const thisModalContentId = '#' + this.modalContentID;
    // this.$(modalButton).attr({'data-target': thisModalContentId});
  // }

  // setRating(rating: number): void {
  //   this.userRating = rating;
  // }

  triggerRate(): void {
    this.rateEvent.emit(this.recipe);
  }

  favorite(): void {
    this.favorited = !this.favorited;

    if (this.favorited) {
      this.recipe.favoriters.push('' + this.userId);
    } else {
      this.recipe.favoriters = this.recipe.favoriters.filter(uId => uId !== '' + this.userId);
    }

    this.favoriteEvent.emit({recipe: this.recipe, favoriting: this.favorited});

  }

}
