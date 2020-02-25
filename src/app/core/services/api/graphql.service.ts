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

@Injectable()
// { providedIn: 'root' }
export class GraphqlService {
  constructor(private httpClient: HttpClient, private apollo: Apollo) {}

  // TODO: modularize some of this code
  // TODO: use IApolloResponse where possible
  submitForApproval(recipe: IRecipe): Observable<any> {
    return this.apollo.mutate({
      mutation: GqlMutations.submitForApprovalMutation,
      variables: {
        recipe,
      },
      refetchQueries: [
        {
          query: GqlQueries.approvalListQuery,
        },
      ],
    });
  }

  updateRecipe(recipe: IRecipe): Observable<any> {
    const submitRecipe = recipe as any;
    let counter = 0;
    const ratersKeys = [];
    const ratersValues = [];
    for (const key of Object.keys(submitRecipe.raters)) {
      ratersKeys.push(key);
      ratersValues.push(String(submitRecipe.raters[key]));
      counter++;
    }
    submitRecipe.raters = {};
    submitRecipe.raters.keys = ratersKeys;
    submitRecipe.raters.values = ratersValues;

    return this.apollo.mutate({
      mutation: GqlMutations.updateRecipeMutation,
      variables: {
        recipeId: recipe._id,
        recipe,
      },
      refetchQueries: [
        { query: GqlQueries.recipeListQuery },
        { query: GqlQueries.recipeEditListQuery },
        { query: GqlQueries.recipeQuery, variables: { recipeId: recipe._id } },
      ],
    });
  }

  approveRecipe(id: string, recipe: IRecipe): Observable<any> {
    return this.apollo
      .mutate<any>({
        mutation: GqlMutations.addRecipeMutation,
        variables: {
          approvalId: id,
          recipe,
        },
        refetchQueries: [
          { query: GqlQueries.approvalListQuery },
          { query: GqlQueries.recipeEditListQuery },
          { query: GqlQueries.recipeListQuery },
        ],
      })
      .pipe(map(result => result.data.addRecipe));
  }

  rejectRecipe(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: GqlMutations.rejectRecipeMutation,
      variables: {
        recipeId: id,
      },
      refetchQueries: [
        {
          query: GqlQueries.approvalListQuery,
        },
      ],
    });
  }

  deleteRecipe(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: GqlMutations.deleteRecipeMutation,
      variables: {
        recipeId: id,
      },
      refetchQueries: [
        { query: GqlQueries.recipeListQuery },
        { query: GqlQueries.recipeEditListQuery },
      ],
    });
  }

  getRecipeList(): Observable<IApolloResponse> {
    return this.apollo
      .watchQuery<any>({
        query: GqlQueries.recipeListQuery,
      })
      .valueChanges.pipe(map(result => result.data.recipes));
  }

  getRecipeEditList(): Observable<IApolloResponse> {
    return this.apollo
      .watchQuery<any>({
        query: GqlQueries.recipeEditListQuery,
      })
      .valueChanges.pipe(map(result => result.data.recipes));
  }

  getRecipe(id: string): Observable<IApolloResponse> {
    return this.apollo
      .watchQuery<any>({
        query: GqlQueries.recipeQuery,
        variables: {
          recipeId: id,
        },
      })
      .valueChanges.pipe(map(result => result.data.recipe));
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
        isAdmins: isAdminArr,
      },
      refetchQueries: [{ query: GqlQueries.userListQuery }],
    });
  }

  getUserList(): Observable<IApolloResponse> {
    return this.apollo
      .watchQuery<any>({
        query: GqlQueries.userListQuery,
      })
      .valueChanges.pipe(map(result => result.data.users));
  }

  getApprovalList(): Observable<IApolloResponse> {
    return this.apollo
      .watchQuery<any>({
        query: GqlQueries.approvalListQuery,
      })
      .valueChanges.pipe(map(result => result.data.unapprovedRecipes));
  }

  getApprovalById(id: string): Observable<IApolloResponse> {
    return this.apollo
      .watchQuery<any>({
        query: GqlQueries.approvalQuery,
        variables: {
          recipeId: id,
        },
      })
      .valueChanges.pipe(map(result => result.data.unapprovedRecipe));
  }

  rateRecipe(
    id: string,
    ratersKeys: string[],
    ratersValues: string[]
  ): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: GqlMutations.rateMutation,
      refetchQueries: [
        { query: GqlQueries.recipeListQuery },
        { query: GqlQueries.recipeQuery, variables: { recipeId: id } },
      ],
      variables: {
        recipeId: id,
        ratersKeys,
        ratersValues,
      },
    });
  }

  favoriteRecipe(id: string, favoriters: string[]): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: GqlMutations.favoriteMutation,
      refetchQueries: [
        { query: GqlQueries.recipeListQuery },
        { query: GqlQueries.recipeQuery, variables: { recipeId: id } },
      ],
      variables: {
        recipeId: id,
        favoriters,
      },
    });
  }

  signIn(username: string, password: string): Observable<any> {
    return this.apollo
      .mutate<any>({
        mutation: GqlMutations.signInMutation,
        variables: {
          username,
          password,
        },
      })
      .pipe(map(result => result.data.signIn));
  }

  signUp(username: string, password: string): Observable<any> {
    return this.apollo
      .mutate<any>({
        mutation: GqlMutations.signUpMutation,
        variables: {
          username,
          password,
        },
      })
      .pipe(map(result => result.data.signUp));
  }

  signOut(): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: GqlQueries.signOutQuery,
    }).valueChanges;
  }
}
