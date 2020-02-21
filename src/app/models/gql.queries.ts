import gql from 'graphql-tag';

export const recipeListQuery = gql`
  {
    recipes {
      _id
      title
      producer
      nutritionValues {
        calories
      }
      favoriters
      raters {
        keys
        values
      }
      imgDir
    }
  }
`;

export const recipeEditListQuery = gql`
  {
    recipes {
      _id
      title
    }
  }
`;

export const userListQuery = gql`
  {
    users {
      _id
      username
      isAdmin
    }
  }
`;

export const approvalListQuery = gql`
  {
    unapprovedRecipes {
      _id
      title
    }
  }
`;

export const recipeQuery = gql`
  query recipe($recipeId: String!) {
    recipe(id: $recipeId) {
      _id
      title
      producer
      ingredients {
        name
        amount
      }
      preCook
      steps {
        name
        body
      }
      nutritionValues {
        calories
        protein
        carbohydrate
        fat
        saturatedFat
        fiber
        sodium
        cholesterol
        sugar
      }
      favoriters
      raters {
        keys
        values
      }
      imgDir
    }
  }
`;

export const approvalQuery = gql`
  query approvalRecipe($recipeId: String!) {
    unapprovedRecipe(id: $recipeId) {
      _id
      title
      producer
      ingredients {
        name
        amount
      }
      preCook
      steps {
        name
        body
      }
      nutritionValues {
        calories
        protein
        carbohydrate
        fat
        saturatedFat
        fiber
        sodium
        cholesterol
        sugar
      }
      favoriters
      raters {
        keys
        values
      }
      imgDir
    }
  }
`;

export const signOutQuery = gql`
  {
    signOut
  }
`;
