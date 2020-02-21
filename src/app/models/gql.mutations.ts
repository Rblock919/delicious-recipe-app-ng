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
  mutation submitForApproval($title: String!, $producer: String!, $ingredientnames: [String]!, $ingredientamounts: [String]!,
  $preCook: [String], $stepnames: [String]!, $stepbodies: [String]!, $imgDir: String!, $calories: Int!, $fat: Int, $saturatedFat: Float,
  $carbohydrate: Int, $sugar: Int, $fiber: Int, $protein: Int, $cholesterol: Int, $sodium: Int) {
    submitForApproval(title: $title, producer: $producer, ingredientnames: $ingredientnames, ingredientamounts: $ingredientamounts,
    preCook: $preCook, stepnames: $stepnames, stepbodies: $stepbodies, imgDir: $imgDir, calories: $calories, fat: $fat,
    saturatedFat: $saturatedFat, carbohydrate: $carbohydrate, sugar: $sugar, fiber: $fiber, protein: $protein, cholesterol: $cholesterol,
    sodium: $sodium)
  }
`;

export const addRecipeMutation = gql`
  mutation addRecipe($approvalId: String!, $title: String!, $producer: String!, $ingredientnames: [String]!, $ingredientamounts: [String]!,
    $preCook: [String], $stepnames: [String]!, $stepbodies: [String]!, $imgDir: String!, $calories: Int!, $fat: Int, $saturatedFat: Float,
    $carbohydrate: Int, $sugar: Int, $fiber: Int, $protein: Int, $cholesterol: Int, $sodium: Int) {
    addRecipe(approvalId: $approvalId, title: $title, producer: $producer, ingredientnames: $ingredientnames, ingredientamounts: $ingredientamounts,
      preCook: $preCook, stepnames: $stepnames, stepbodies: $stepbodies, imgDir: $imgDir, calories: $calories, fat: $fat,
      saturatedFat: $saturatedFat, carbohydrate: $carbohydrate, sugar: $sugar, fiber: $fiber, protein: $protein, cholesterol: $cholesterol,
      sodium: $sodium) {
      id
    }
  }
`;

export const updateRecipeMutation = gql`
    mutation updateRecipe($recipeId: String!, $title: String!, $producer: String!, $ingredientnames: [String]!, $ingredientamounts: [String]!,
      $preCook: [String], $stepnames: [String]!, $stepbodies: [String]!, $imgDir: String!, $calories: Int!, $fat: Int, $saturatedFat: Float,
      $carbohydrate: Int, $sugar: Int, $fiber: Int, $protein: Int, $cholesterol: Int, $sodium: Int) {
      updateRecipe(recipeId: $recipeId, title: $title, producer: $producer, ingredientnames: $ingredientnames, ingredientamounts: $ingredientamounts,
        preCook: $preCook, stepnames: $stepnames, stepbodies: $stepbodies, imgDir: $imgDir, calories: $calories, fat: $fat,
        saturatedFat: $saturatedFat, carbohydrate: $carbohydrate, sugar: $sugar, fiber: $fiber, protein: $protein, cholesterol: $cholesterol,
        sodium: $sodium)
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
  mutation rateRecipe($recipeId: String!, $ratersKeys: [String]!, $ratersValues: [String]!) {
    rateRecipe(id: $recipeId, ratersKeys: $ratersKeys, ratersValues: $ratersValues)
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
