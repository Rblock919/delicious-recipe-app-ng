import { Pipe, PipeTransform } from '@angular/core';
import {IRecipe} from '../../models/recipe.model';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {
  topFilter = '';
  botFilter = '';
  selectedRecipeList: IRecipe[];
  userId = 0;

  transform(value: any, ...args: any[]): any {
    this.topFilter = !!args[0] ? args[0] : '';
    this.botFilter = !!args[1] ? args[1] : '';
    this.userId = !!args[2] ? args[2] : 0;

    if (this.topFilter === '' && this.botFilter === '') {
      return value;
    }

    this.selectedRecipeList = [] as IRecipe[];

    if (this.topFilter === 'new') {
      this.selectedRecipeList = value.slice((value.length - 6), (value.length));
    } else if (this.topFilter === 'hot') {
      let tempList: IRecipe[];
      tempList = value.slice(0);

      tempList.sort((a, b) => {
        let aAvg = 0;
        let bAvg = 0;
        let counter = 0;
        for (const rate of Object.values(a.raters)) {
          aAvg += Number(rate);
          counter++;
        }
        aAvg /= counter;

        counter = 0;
        for (const rate of Object.values(b.raters)) {
          bAvg += Number(rate);
          counter++;
        }
        bAvg /= counter;

        if (isNaN(aAvg)) {
          aAvg = 0;
        }
        if (isNaN(bAvg)) {
          bAvg = 0;
        }

        if (aAvg > bAvg) {
          return -1;
        } else {
          return 1;
        }

      });

      for (let i = 0; i < 12; i++) {
        if (Object.values(tempList[i].raters).length > 0) {
          this.selectedRecipeList.push(tempList[i]);
        }
      }
    } else if (this.topFilter === 'fav') {
      this.selectedRecipeList = value.filter(recipe => {
        return (recipe.favoriters.indexOf('' + this.userId) > -1 );
      });
    }

    // set selectedRecipeList to value if it wasn't already set above with top filters
    this.selectedRecipeList = this.topFilter === '' ? value : this.selectedRecipeList;

    if (this.botFilter === 'Hello Fresh') {
      this.selectedRecipeList = this.selectedRecipeList.filter(recipe => {
        return (recipe.producer === 'Hello Fresh');
      });
    } else if (this.botFilter === 'Home Chef') {
      this.selectedRecipeList = this.selectedRecipeList.filter(recipe => {
        return (recipe.producer === 'Home Chef');
      });
    } else if (this.botFilter === 'Blue Apron') {
      this.selectedRecipeList = this.selectedRecipeList.filter(recipe => {
        return (recipe.producer === 'Blue Apron');
      });
    }

    return this.selectedRecipeList;
  }

}
