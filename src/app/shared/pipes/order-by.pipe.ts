import { Pipe, PipeTransform } from '@angular/core';
import {IRecipe} from '../../models/recipe.model';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  sortFilter = '';
  sortDirection = '';
  selectedRecipeList: IRecipe[];

  transform(value: any, ...args: any[]): any {
    this.sortFilter = !!args[0] ? args[0] : '';
    this.sortDirection = !!args[1] ? args[1] : '';

    if (this.sortDirection === '' && this.sortFilter === '') {
      // sort by original ordering if no sort filter/direction present
      return value.sort((a, b) => {
        if (a._id > b._id) {
          return 1;
        } else {
          return -1;
        }
      });
    }

    this.selectedRecipeList = value as IRecipe[];

    if (this.sortDirection === 'up') {
      if (this.sortFilter === 'calories') {
        this.selectedRecipeList.sort((a, b) => (a.nutritionValues.calories > b.nutritionValues.calories ? 1 : -1));
      } else if (this.sortFilter === 'rating') {

        this.selectedRecipeList.sort((a, b) => {
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

          // console.log(`Avg of recipeA(${a.title}): ${aAvg} compared to avg of recipeB(${b.title}): ${bAvg}`);

          if (isNaN(aAvg)) {
            aAvg = 0;
          }
          if (isNaN(bAvg)) {
            bAvg = 0;
          }

          if (aAvg > bAvg) {
            return 1;
          } else {
            return -1;
          }

        });
      } else if (this.sortFilter === 'title') {
        this.selectedRecipeList.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1));
      }
    } else if (this.sortDirection === 'down') {
      if (this.sortFilter === 'calories') {
        this.selectedRecipeList.sort((a, b) => (a.nutritionValues.calories > b.nutritionValues.calories ? -1 : 1));
      } else if (this.sortFilter === 'rating') {

        this.selectedRecipeList.sort((a, b) => {
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

          // console.log(`Avg of recipeA(${a.title}): ${aAvg} compared to avg of recipeB(${b.title}): ${bAvg}`);

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

      } else if (this.sortFilter === 'title') {
        this.selectedRecipeList.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? -1 : 1));
      }
    }

    return this.selectedRecipeList;
  }

}
