import gql from 'graphql-tag';

export const signInMutation = gql`
  mutation signIn($username: String!, $password: String!) {
    login(user: { username: $username, password: $password }) {
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
    submitForApproval(recipe: $recipe)
  }
`;

export const addRecipeMutation = gql`
  mutation addRecipe($approvalId: ID!, $recipe: RecipeInput!) {
    add(approvalId: $approvalId, recipe: $recipe)
  }
`;

export const updateRecipeMutation = gql`
  mutation updateRecipe($recipe: RecipeInput!) {
    update(recipe: $recipe) {
      _id
    }
  }
`;

export const updateUsersMutation = gql`
  mutation updateUsers($editUserData: [EditUserInput!]!) {
    updateUsers(userData: $editUserData)
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
  mutation rateRecipe(
    $recipeId: ID!
    $ratersKeys: [String!]!
    $ratersValues: [Int!]!
  ) {
    rate(id: $recipeId, ratersKeys: $ratersKeys, ratersValues: $ratersValues) {
      _id
    }
  }
`;

export const favoriteMutation = gql`
  mutation favoriteRecipe($recipeId: ID!, $favoriters: [String!]!) {
    favorite(id: $recipeId, favoriters: $favoriters) {
      _id
    }
  }
`;

export const signUpMutation = gql`
  mutation signUp($username: String!, $password: String!) {
    register(userInfo: { username: $username, password: $password }) {
      token
      user {
        _id
        username
        isAdmin
      }
    }
  }
`;
