export interface IRecipe {
  _id: string;
  title: string;
  producer?: string;
  ingredients?: [
    {
      name: string,
      amount: string
    }
  ];
  preCook?: string[];
  steps?: [
    {
    name: string,
    body: string,
    }
  ];
  nutritionValues?: {
    calories: number,
    fat?: number,
    saturatedFat?: number,
    carbohydrate?: number,
    sugar?: number,
    fiber?: number,
    protein?: number,
    cholesterol?: number,
    sodium?: number
  };
  imgDir?: string;
  favoriters?: string[];
  raters?: Map<string, number>;
}

export interface IRecipeResolved {
  recipe: IRecipe;
  error?: any;
}

export interface IRecipesResolved {
  recipes: IRecipe[];
  error?: any;
}

//    GraphQL Data Models
export interface IRecipeGQL {
  _id: string;
  title: string;
  producer?: string;
  nutritionValues?: {
    calories: number;
  };
  favoriters?: string[];
  raters?: {
    keys: string[],
    values: number[]
  };
  imgDir?: string;
}

export interface IRecipeGQLResolved {
  recipe: IRecipeGQL;
  error?: any;
}

export interface IRecipesGQLResolved {
  recipes: IRecipeGQL[];
  error?: any;
}
