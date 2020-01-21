import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IApolloResponse } from '../../../models/apollo.model';
import { IRecipe } from '../../../models/recipe.model';
import * as GqlQueries from '../../../models/gql.queries';
import * as GqlMutations from '../../../models/gql.mutations';

@Injectable(
  // { providedIn: 'root' }
)
export class GraphqlService {

  constructor(private httpClient: HttpClient, private apollo: Apollo) { }

  // TODO: modularize some of this code
  // TODO: use IApolloResponse where possible
  // TODO: pipe and map all values to that subscribing components don't have to handle doing that
  submitForApproval(recipe: any): Observable<any> {
    console.log(`recipe: ${JSON.stringify(recipe)}`);
    const ingredientnames = [];
    const ingredientamounts = [];
    const stepnames = [];
    const stepbodies = [];
    const preCook = [];
    for (const step of recipe.steps) {
      stepnames.push(step.name);
      stepbodies.push(step.body);
    }
    for (const ingredient of recipe.ingredients) {
      ingredientnames.push(ingredient.name);
      ingredientamounts.push(ingredient.amount);
    }
    for (const step of recipe.preCook) {
      preCook.push(step.body);
    }

    // return of(null);

    return this.apollo.mutate({
      mutation: GqlMutations.submitForApprovalMutation,
      variables: {
        title: recipe.title,
        producer: recipe.producer,
        ingredientnames,
        ingredientamounts,
        preCook,
        stepnames,
        stepbodies,
        imgDir: recipe.imgDir,
        calories: +recipe.nutrition.calories,
        // TODO: possibly make sure values that weren't provided are assigned as a proper value before getting sent to back-end
        carbohydrate: +recipe.nutrition.carbohydrate,
        fat: +recipe.nutrition.fat,
        protein: +recipe.nutrition.protein,
        saturatedFat: +recipe.nutrition.saturatedFat,
        sugar: +recipe.nutrition.sugar,
        fiber: +recipe.nutrition.fiber,
        cholesterol: +recipe.nutrition.cholesterol,
        sodium: +recipe.nutrition.sodium
      },
      refetchQueries: [{
        query: GqlQueries.approvalListQuery
      }]
    });
  }

  approveRecipe(id: string, recipe: any): Observable<any> {
    console.log(`recipe: ${JSON.stringify(recipe)}`);
    const ingredientnames = [];
    const ingredientamounts = [];
    const stepnames = [];
    const stepbodies = [];
    const preCook = [];
    for (const step of recipe.steps) {
      stepnames.push(step.name);
      stepbodies.push(step.body);
    }
    for (const ingredient of recipe.ingredients) {
      ingredientnames.push(ingredient.name);
      ingredientamounts.push(ingredient.amount);
    }
    for (const step of recipe.preCook) {
      preCook.push(step.body);
    }

    // return of(null);

    return this.apollo.mutate<any>({
      mutation: GqlMutations.addRecipeMutation,
      variables: {
        approvalId: id,
        title: recipe.title,
        producer: recipe.producer,
        ingredientnames,
        ingredientamounts,
        preCook,
        stepnames,
        stepbodies,
        imgDir: recipe.imgDir,
        calories: +recipe.nutrition.calories,
        // TODO: possibly make sure values that weren't provided are assigned as a proper value before getting sent to back-end
        carbohydrate: +recipe.nutrition.carbohydrate,
        fat: +recipe.nutrition.fat,
        protein: +recipe.nutrition.protein,
        saturatedFat: +recipe.nutrition.saturatedFat,
        sugar: +recipe.nutrition.sugar,
        fiber: +recipe.nutrition.fiber,
        cholesterol: +recipe.nutrition.cholesterol,
        sodium: +recipe.nutrition.sodium
      },
      refetchQueries: [
        { query: GqlQueries.approvalListQuery },
        { query: GqlQueries.recipeEditListQuery },
        { query: GqlQueries.recipeListQuery }
      ]
    }).pipe(map(result => result.data.addRecipe));
  }

  rejectRecipe(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: GqlMutations.rejectRecipeMutation,
      variables: {
        recipeId: id
      },
      refetchQueries: [{
        query: GqlQueries.approvalListQuery
      }]
    });
  }

  getRecipeList(): Observable<IApolloResponse> {
    return this.apollo.watchQuery<IApolloResponse>({
      query: GqlQueries.recipeListQuery
    }).valueChanges;
  }

  getRecipeEditList(): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: GqlQueries.recipeEditListQuery
    }).valueChanges;
  }

  getRecipe(id: string): Observable<any> {
    return this.apollo.watchQuery({
      query: GqlQueries.recipeQuery,
      variables: {
        recipeId: id
      }
    }).valueChanges;
  }

  updateUsers(): void {
    console.log('to do: create update users mutation...');
  }

  getUserList(): Observable<any> {
    return this.apollo.watchQuery({
      query: GqlQueries.userListQuery
    }).valueChanges;
  }

  getApprovalList(): Observable<any> {
    return this.apollo.watchQuery({
      query: GqlQueries.approvalListQuery
    }).valueChanges;
  }

  getApprovalById(id: string): Observable<any> {
    return this.apollo.watchQuery({
      query: GqlQueries.approvalQuery,
      variables: {
        recipeId: id
      }
    }).valueChanges;
  }

  rateRecipe(id: string, ratersKeys: string[], ratersValues: string[]): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: GqlMutations.rateMutation,
      refetchQueries: [{
        query: GqlQueries.recipeListQuery
      }],
      variables: {
        recipeId: id,
        ratersKeys,
        ratersValues
      }
    });
  }

  favoriteRecipe(id: string, favoriters: string[]): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: GqlMutations.favoriteMutation,
      refetchQueries: [{
        query: GqlQueries.recipeListQuery
      }],
      variables: {
        recipeId: id,
        favoriters
      }
    });
  }

  signIn(username: string, password: string): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: GqlMutations.signInMutation,
      variables: {
        username,
        password
      }
    }).pipe(map(result => result.data.signIn));
  }

  signUp(username: string, password: string): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: GqlMutations.signUpMutation,
      variables: {
        username,
        password
      }
    }).pipe(map(result => result.data.signUp));
  }

  // TODO: see if I should still use IApolloResponse here?
  signOut(): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: GqlQueries.signOutQuery
    }).valueChanges;
  }

}
