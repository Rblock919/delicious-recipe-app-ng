export interface IRecipe {
  _id: number;
  title: string;
  producer: string;
  ingredients: string[];
  preCook: string[];
  steps: [
    {
    name: string,
    body: string,
    }
  ];
  nutritionValues: {
    calories: number,
    fat: number,
    saturatedFat: number,
    carbohydrate: number,
    sugar: number,
    fiber: number,
    protein: number,
    cholesterol: number,
    sodium: number
  };
  imgDir: string;
  favoriters: string[];
  raters: Map<number, number>;
}

export interface IRecipeResolved {
  recipe: IRecipe;
  error?: any;
}

export interface IRecipesResolved {
  recipes: IRecipe[];
  error?: any;
}
