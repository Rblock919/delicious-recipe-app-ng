import { Component, OnInit } from '@angular/core';

import { IRecipe } from '../../models/recipe.model';
import {GraphqlService} from '../../core/services/api/graphql.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {

  private recipes: IRecipe[];
  loading = true;

  constructor(private gqlService: GraphqlService) { }

  ngOnInit() {
    // this.gqlService.getRecipeList().subscribe((result) => {
    //   console.log('result: ' + JSON.stringify(result.data));
    // }, err => {
    //   console.log(`err ${err}`);
    // });
  }

}
