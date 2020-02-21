import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IApolloResponse } from '../../../models/apollo.model';
import { IRecipe } from '../../../models/recipe.model';
import { IUser } from '../../../models/user.model';
import * as GqlQueries from '../../../models/gql.queries';
import * as GqlMutations from '../../../models/gql.mutations';

@Injectable(
  // { providedIn: 'root' }
)
export class GraphqlService {

  constructor(private httpClient: HttpClient, private apollo: Apollo) { }

  // TODO: modularize some of this code
  // TODO: use IApolloResponse where possible
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

  updateRecipe(recipe: any): Observable<any> {
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
    console.log(`recipe: ${JSON.stringify(recipe)}`);

    // return of (null);

    return this.apollo.mutate({
      mutation: GqlMutations.updateRecipeMutation,
      variables: {
        recipeId: recipe._id,
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
        { query: GqlQueries.recipeListQuery },
        { query: GqlQueries.recipeEditListQuery }
      ]
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

  deleteRecipe(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: GqlMutations.deleteRecipeMutation,
      variables: {
        recipeId: id
      },
      refetchQueries: [
        { query: GqlQueries.recipeListQuery },
        { query: GqlQueries.recipeEditListQuery }
      ]
    });
  }

  getRecipeList(): Observable<IApolloResponse> {
    return this.apollo.watchQuery<any>({
      query: GqlQueries.recipeListQuery
    }).valueChanges.pipe(map(result => result.data.recipes));
  }

  getRecipeEditList(): Observable<IApolloResponse> {
    return this.apollo.watchQuery<any>({
      query: GqlQueries.recipeEditListQuery
    }).valueChanges.pipe(map(result => result.data.recipes));
  }

  getRecipe(id: string): Observable<IApolloResponse> {
    return this.apollo.watchQuery<any>({
      query: GqlQueries.recipeQuery,
      variables: {
        recipeId: id
      }
    }).valueChanges.pipe(map(result => result.data.recipe));
  }

  updateUsers(users: IUser[]): Observable<any> {
    const idArr = [];
    const isAdminArr = [];

    for (const user of users) {
      idArr.push(user._id);
      isAdminArr.push(user.isAdmin);
    }
    return this.apollo.mutate({
      mutation: GqlMutations.updateUsersMutation,
      variables: {
        ids: idArr,
        isAdmins: isAdminArr
      },
      refetchQueries: [{query: GqlQueries.userListQuery}]
    });
  }

  getUserList(): Observable<IApolloResponse> {
    return this.apollo.watchQuery<any>({
      query: GqlQueries.userListQuery
    }).valueChanges.pipe(map(result => result.data.users));
  }

  getApprovalList(): Observable<IApolloResponse> {
    return this.apollo.watchQuery<any>({
      query: GqlQueries.approvalListQuery
    }).valueChanges.pipe(map(result => result.data.unapprovedRecipes));
  }

  getApprovalById(id: string): Observable<IApolloResponse> {
    return this.apollo.watchQuery<any>({
      query: GqlQueries.approvalQuery,
      variables: {
        recipeId: id
      }
    }).valueChanges.pipe(map(result => result.data.unapprovedRecipe));
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

  signOut(): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: GqlQueries.signOutQuery
    }).valueChanges;
  }

}
