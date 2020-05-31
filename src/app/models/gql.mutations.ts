import gql from 'graphql-tag';

export const signInMutation = gql`
  mutation signIn($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
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
  mutation submitForApproval($recipe: RecipeInput!) {
    submit(input: $recipe)
  }
`;

export const addRecipeMutation = gql`
  mutation addRecipe($approvalId: ID!, $recipe: RecipeInput!) {
    approve(input: { approvalId: $approvalId, recipe: $recipe }) {
      _id
    }
  }
`;

export const updateRecipeMutation = gql`
  mutation updateRecipe($recipe: RecipeInput!, $recipeId: ID!) {
    update(input: { recipeId: $recipeId, recipe: $recipe }) {
      _id
    }
  }
`;

export const updateUsersMutation = gql`
  mutation updateUsers($editUserData: [UpdateUserInput!]!) {
    updateUsers(input: $editUserData)
  }
`;

export const deleteRecipeMutation = gql`
  mutation deleteRecipe($recipeId: ID!) {
    delete(id: $recipeId)
  }
`;

export const rejectRecipeMutation = gql`
  mutation rejectRecipe($recipeId: ID!) {
    reject(id: $recipeId)
  }
`;

export const rateMutation = gql`
  mutation rateRecipe($recipeId: ID!, $value: Int!) {
    rate(input: { recipeId: $recipeId, rating: $value })
  }
`;

export const favoriteMutation = gql`
  mutation favoriteRecipe($recipeId: ID!) {
    favorite(id: $recipeId)
  }
`;

export const signUpMutation = gql`
  mutation signUp($username: String!, $password: String!) {
    register(input: { username: $username, password: $password }) {
      token
      user {
        _id
        username
        isAdmin
      }
    }
  }
`;
