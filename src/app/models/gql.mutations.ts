import gql from 'graphql-tag';

export const signInMutation = gql`
  mutation signIn($username: String!, $password: String!) {
    signIn(username: $username, password: $password) {
      token
      user {
        _id
        username
        isAdmin
      }
    }
  }
`;

export const submitForApprovalMutation = gql`
  mutation submitForApproval($recipe: inRecipe) {
    submitForApproval(recipe: $recipe)
  }
`;

export const addRecipeMutation = gql`
  mutation addRecipe($approvalId: String!, $recipe: inRecipe) {
    addRecipe(approvalId: $approvalId, recipe: $recipe) {
      id
    }
  }
`;

export const updateRecipeMutation = gql`
  mutation updateRecipe($recipeId: String!, $recipe: inRecipe) {
    updateRecipe(recipeId: $recipeId, recipe: $recipe)
  }
`;

export const updateUsersMutation = gql`
  mutation updateUsers($ids: [String]!, $isAdmins: [Boolean]!) {
    updateUsers(idArr: $ids, isAdminArr: $isAdmins)
  }
`;

export const deleteRecipeMutation = gql`
  mutation deleteRecipe($recipeId: String!) {
    deleteRecipe(id: $recipeId)
  }
`;

export const rejectRecipeMutation = gql`
  mutation rejectRecipe($recipeId: String!) {
    rejectRecipe(id: $recipeId)
  }
`;

export const rateMutation = gql`
  mutation rateRecipe(
    $recipeId: String!
    $ratersKeys: [String]!
    $ratersValues: [String]!
  ) {
    rateRecipe(
      id: $recipeId
      ratersKeys: $ratersKeys
      ratersValues: $ratersValues
    )
  }
`;

export const favoriteMutation = gql`
  mutation favoriteRecipe($recipeId: String!, $favoriters: [String]!) {
    favoriteRecipe(id: $recipeId, favoriters: $favoriters)
  }
`;

export const signUpMutation = gql`
  mutation signUp($username: String!, $password: String!) {
    signUp(username: $username, password: $password) {
      token
      user {
        _id
        username
        isAdmin
      }
    }
  }
`;
