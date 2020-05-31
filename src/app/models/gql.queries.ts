import gql from 'graphql-tag';

export const recipeListQuery = gql`
  query recipeList {
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
  query recipeEditList {
    recipes {
      _id
      title
    }
  }
`;

export const userListQuery = gql`
  query userList {
    users {
      _id
      username
      isAdmin
    }
  }
`;

export const approvalListQuery = gql`
  query approvalList {
    unapprovedRecipes {
      _id
      title
    }
  }
`;

export const recipeQuery = gql`
  query recipe($recipeId: ID!) {
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
  query approvalRecipe($recipeId: ID!) {
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
  query signOut {
    logout
  }
`;

export const getUserDataQuery = gql`
  query getUserData {
    me {
      _id
      username
      isAdmin
    }
  }
`;
