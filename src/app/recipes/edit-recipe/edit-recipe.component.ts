import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormArray,
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { RecipeApiService } from 'src/app/core/services/api/recipe-api.service';
import { IRecipe, IRecipeResolved } from 'src/app/models/recipe.model';
import { TOASTR_TOKEN, Toastr } from '../../core/services/toastr.service';

function numberChecker(): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    const isNotNumber = isNaN(c.value);

    if (c.dirty && isNotNumber && c.value !== '') {
      return { numberType: true };
    }

    return null;
  };
}

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss'],
})
export class EditRecipeComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  private producerSub: Subscription;
  private imgUrlSub: Subscription;

  recipeForm: FormGroup;
  recipeProducer: string;
  pageTitle: any;
  preCookTitle: string;
  id: any;
  recipe: IRecipe;
  imageDir: string;
  submitted = false;
  blueApronNutritionFlag = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: RecipeApiService,
    @Inject(TOASTR_TOKEN) private toastr: Toastr,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.recipeForm = this.fb.group({
      producer: ['', Validators.required],
      title: ['', Validators.required],
      ingredients: this.fb.array([]),
      preCook: this.fb.array([]),
      steps: this.fb.array([]),
      nutrition: this.fb.group({
        calories: ['', [Validators.required, numberChecker()]],
        fat: ['', [Validators.required, numberChecker()]],
        carbohydrate: ['', [Validators.required, numberChecker()]],
        protein: ['', [Validators.required, numberChecker()]],
        sugar: ['', [Validators.required, numberChecker()]],
        saturatedFat: ['', [Validators.required, numberChecker()]],
        cholesterol: ['', [Validators.required, numberChecker()]],
        fiber: ['', [Validators.required, numberChecker()]],
        sodium: ['', [Validators.required, numberChecker()]],
      }),
      imgDir: ['', Validators.required],
    });

    this.sub = this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id === '0') {
        this.pageTitle = 'Add Recipe';
      } else {
        this.pageTitle = 'Edit Recipe';
      }
      this.getRecipeInfo();
    });
  }

  watchProducer(): void {
    const producerControl = this.recipeForm.get('producer');
    const nutritionControl = this.recipeForm.get('nutrition');

    this.producerSub = producerControl.valueChanges.subscribe(value => {
      if (value === 'Blue Apron') {
        this.preCookTitle = '';
        console.log('handling validation changes based upon BA selection');
        this.removeHomeChefValidators(nutritionControl);
        this.removeHelloFreshValidators(nutritionControl);

        /* using the following loop to clear validators so if the user has entered precook stuff then switched to blue apron
        the form will not clear the values in case they switch back but clear the validators so the form is valid. When the form
        is submitted if the producer is blue apron then this comp will then clear the values so they don't get submitted to database */
        let preCookCounter = 0;
        while (preCookCounter < this.preCook.length) {
          this.preCook
            .at(preCookCounter)
            .get('body')
            .clearValidators();
          this.preCook
            .at(preCookCounter)
            .get('body')
            .updateValueAndValidity();
          preCookCounter++;
        }
      } else if (value === 'Home Chef') {
        // in the case of submitting blue apron originally then changing to home chef... might delete after reactivating submit function
        // but also might keep if I create a modal window to confirm recipe and they choose no and go back to blue apron?
        if (this.preCook.length === 0) {
          this.preCook.push(this.buildPreCook());
        }
        this.preCookTitle = 'Before You Cook Instructions:';
        this.addHomeChefValidators(nutritionControl);
        this.removeHelloFreshValidators(nutritionControl);
        this.reAddPreCookValidators();
        console.log('handling validation changed based upon HC selection');
      } else if (value === 'Hello Fresh') {
        // in the case of submitting blue apron originally then changing to hello fresh... might delete after reactivating submit function
        // but also might keep if I create a modal window to confirm recipe and they choose no and go back to blue apron?
        if (this.preCook.length === 0) {
          this.preCook.push(this.buildPreCook());
        }
        this.preCookTitle = 'What to Bust Out Before You Cook:';
        this.addHomeChefValidators(nutritionControl);
        this.addHelloFreshValidators(nutritionControl);
        this.reAddPreCookValidators();
        console.log('handling validation changes based upon HF selection');
      } else {
        console.log('in else clause');
      }

      console.log('Producer changed to: ' + value);
      this.recipeProducer = value;
    });
  }

  clearFormArray(formArray: FormArray): void {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  reAddPreCookValidators(): void {
    let counter = 0;
    while (counter < this.preCook.length) {
      this.preCook
        .at(counter)
        .get('body')
        .setValidators(Validators.required);
      this.preCook
        .at(counter)
        .get('body')
        .updateValueAndValidity();
      counter++;
    }
  }

  watchImageUrl(): void {
    const imageControl = this.recipeForm.get('imgDir');
    this.imgUrlSub = imageControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(value => {
        this.imageDir = value;
      });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  get preCook(): FormArray {
    return this.recipeForm.get('preCook') as FormArray;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.producerSub.unsubscribe();
    this.imgUrlSub.unsubscribe();
  }

  changeBlueApronNutritionalFlag(): void {
    this.blueApronNutritionFlag = !this.blueApronNutritionFlag;
    const nutritionControl = this.recipeForm.get('nutrition');
    if (!this.blueApronNutritionFlag) {
      console.log('no BA nutritional info \nRemoving validators...');
      this.removeHelloFreshValidators(nutritionControl);
      this.removeHomeChefValidators(nutritionControl);
    } else {
      console.log('BA nutritional info \nAdding validators...');
      this.addHelloFreshValidators(nutritionControl);
      this.addHomeChefValidators(nutritionControl);
    }
  }

  saveForm(): void {
    if (!this.recipeForm.valid) {
      console.log('trying to save invalid form');
      this.markFormGroupTouched(this.recipeForm);
      this.toastr.warning('Fix form field errors and try again.');
      // console.log(this.recipeForm.controls);
      return;
    }

    if (this.recipeProducer === 'Blue Apron') {
      console.log(
        'user submitting blue apron recipe. Clearing preCook array...'
      );
      this.clearFormArray(this.preCook);
      if (!this.blueApronNutritionFlag) {
        console.log('saving BA form that doesnt provide nutrition info');
        const nutritionControl = this.recipeForm.get('nutrition');
        nutritionControl.get('fat').patchValue(null);
        nutritionControl.get('carbohydrate').patchValue(null);
        nutritionControl.get('protein').patchValue(null);
        nutritionControl.get('sodium').patchValue(null);
        nutritionControl.get('sugar').patchValue(null);
        nutritionControl.get('saturatedFat').patchValue(null);
        nutritionControl.get('cholesterol').patchValue(null);
        nutritionControl.get('fiber').patchValue(null);
      }
    }

    // TODO: implement a better system of checking for extra nutrition info than just checking sugar
    // if (this.recipeProducer === 'Home Chef' && this.recipeForm.get('nutrition.sugar').value !== '') {
    if (this.recipeProducer === 'Home Chef') {
      const nutritionControl = this.recipeForm.get('nutrition');
      nutritionControl.get('sugar').patchValue(null);
      nutritionControl.get('saturatedFat').patchValue(null);
      nutritionControl.get('cholesterol').patchValue(null);
      nutritionControl.get('fiber').patchValue(null);
    }

    // console.log('recipe form value: ' + JSON.stringify(this.recipeForm.value));
    // return;

    const formRecipe = this.recipeForm.value as IRecipe;

    this.prepRecipeForSubmit(formRecipe);
    // console.log(`formRecipe: ${JSON.stringify(formRecipe)}`);

    // user is adding new recipe
    if (this.id === '0') {
      this.apiService.submitRecipeForApproval(formRecipe).subscribe(
        res => {
          this.submitted = true;
          this.toastr.success('Recipe Submitted for Approval!');
          this.router.navigate(['/recipe/submitted']);
        },
        err => {
          this.toastr.error(
            'Error submitting recipe. Check fields and try again'
          );
          console.log('ERROR CREATING RECIPE: ' + JSON.stringify(err));
        }
      );
    } else {
      // user is editing current recipe

      console.log({ formRecipe }); // has raters/keys arrays
      console.log({ thisRecipe: this.recipe }); // has raters as map

      // const tmpMap = new Map<string, number>();
      const tmpRecipe = formRecipe as any;

      // let counter = 0;
      // for (const key of tmpRecipe.raters.keys) {
      //   tmpMap[key] = tmpRecipe.raters.values[counter];
      //   counter++;
      // }

      // this.recipe.raters = tmpMap;

      formRecipe._id = this.id;
      formRecipe.nutritionValues = tmpRecipe.nutrition;
      // formRecipe.favoriters = this.recipe.favoriters;
      // formRecipe.raters = this.recipe.raters;
      console.log(`formRecipe right before: ${JSON.stringify(formRecipe)}`);
      this.apiService.updateRecipe(formRecipe).subscribe(
        res => {
          this.submitted = true;
          this.toastr.success('Recipe Successfully Updated!');
          this.router.navigate(['recipe', this.id]);
        },
        err => {
          this.toastr.error('Error Updating Recipe');
          console.log('ERROR UPDATING RECIPE: ' + JSON.stringify(err));
        }
      );
    }
  }

  getRecipeInfo(): void {
    if (this.id === '0') {
      // adding a recipe instead of editing one
      this.recipeForm = this.fb.group({
        producer: ['', Validators.required],
        title: ['', Validators.required],
        ingredients: this.fb.array([this.buildIngredient()]),
        preCook: this.fb.array([this.buildPreCook()]),
        steps: this.fb.array([this.buildStep()]),
        nutrition: this.fb.group({
          calories: ['', [Validators.required, numberChecker()]],
          fat: ['', [Validators.required, numberChecker()]],
          carbohydrate: ['', [Validators.required, numberChecker()]],
          protein: ['', [Validators.required, numberChecker()]],
          sugar: ['', [Validators.required, numberChecker()]],
          saturatedFat: ['', [Validators.required, numberChecker()]],
          cholesterol: ['', [Validators.required, numberChecker()]],
          fiber: ['', [Validators.required, numberChecker()]],
          sodium: ['', [Validators.required, numberChecker()]],
        }),
        imgDir: ['', Validators.required],
      });

      this.recipe = {} as IRecipe;
      this.imageDir = '';
      this.watchImageUrl();
      this.watchProducer();
    } else {
      // editing a recipe

      this.apiService.getRecipe(this.id).subscribe(
        result => {
          console.log(`result: ${JSON.stringify(result)}`);

          this.watchImageUrl();
          this.watchProducer();

          this.recipe = result;

          if (this.ingredients) {
            this.ingredients.reset();
          }
          if (this.steps) {
            this.steps.reset();
          }

          this.blueApronNutritionFlag =
            this.recipe.producer === 'Blue Apron' &&
            !!this.recipe.nutritionValues.fat;

          let ingredientCounter = 0;
          let stepCounter = 0;
          let preCookCounter = 0;

          this.recipe.ingredients.forEach(element => {
            this.ingredients.push(this.buildIngredient());
            this.ingredients.at(ingredientCounter).patchValue({
              name: element.name,
              amount: element.amount,
            });
            ingredientCounter++;
          });

          this.recipe.preCook.forEach(element => {
            this.preCook.push(this.buildPreCook());
            this.preCook.at(preCookCounter).patchValue({
              body: element,
            });
            preCookCounter++;
          });

          this.recipe.steps.forEach(step => {
            // console.log('Step ' + (stepCounter + 1) + ': ' + step.name + ' - ' + step.body);
            this.steps.push(this.buildStep());
            this.steps.at(stepCounter).patchValue({
              name: step.name,
              body: step.body,
            });
            stepCounter++;
          });

          this.imageDir = this.recipe.imgDir;

          this.recipeForm.patchValue({
            producer: this.recipe.producer,
            title: this.recipe.title,
            nutrition: this.recipe.nutritionValues,
            imgDir: this.recipe.imgDir,
          });
          // });
        },
        err => {
          console.log(`err: ${err}`);
        }
      );
    }
  }

  prepRecipeForSubmit(recipe: any): void {
    const preCook = [];
    for (const step of recipe.preCook) {
      preCook.push(step.body);
    }
    recipe.preCook = preCook;
    recipe.nutrition.calories = +recipe.nutrition.calories;
    recipe.nutrition.fat =
      recipe.nutrition.fat === null ? null : +recipe.nutrition.fat;
    recipe.nutrition.carbohydrate =
      recipe.nutrition.carbohydrate === null
        ? null
        : +recipe.nutrition.carbohydrate;
    recipe.nutrition.protein =
      recipe.nutrition.protein === null ? null : +recipe.nutrition.protein;
    recipe.nutrition.sodium =
      recipe.nutrition.sodium === null ? null : +recipe.nutrition.sodium;
    recipe.nutrition.saturatedFat =
      recipe.nutrition.saturatedFat === null
        ? null
        : +recipe.nutrition.saturatedFat;
    recipe.nutrition.sugar =
      recipe.nutrition.sugar === null ? null : +recipe.nutrition.sugar;
    recipe.nutrition.fiber =
      recipe.nutrition.fiber === null ? null : +recipe.nutrition.fiber;
    recipe.nutrition.cholesterol =
      recipe.nutrition.cholesterol === null
        ? null
        : +recipe.nutrition.cholesterol;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    (Object as any).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  buildPreCook(): FormGroup {
    return this.fb.group({
      body: ['', Validators.required],
    });
  }

  buildIngredient(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }

  buildStep(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  addPreCook(): void {
    this.preCook.push(this.buildPreCook());
  }

  addIngredient(): void {
    this.ingredients.push(this.buildIngredient());
  }

  addStep(): void {
    this.steps.push(this.buildStep());
  }

  removePreCook(id: number): void {
    this.preCook.removeAt(id);
  }

  removeIngredient(id: number): void {
    this.ingredients.removeAt(id);
  }

  removeStep(id: number): void {
    this.steps.removeAt(id);
  }

  addHomeChefValidators(formControl: AbstractControl): void {
    formControl
      .get('fat')
      .setValidators([Validators.required, numberChecker()]);
    formControl.get('fat').updateValueAndValidity();
    formControl
      .get('carbohydrate')
      .setValidators([Validators.required, numberChecker()]);
    formControl.get('carbohydrate').updateValueAndValidity();
    formControl
      .get('protein')
      .setValidators([Validators.required, numberChecker()]);
    formControl.get('protein').updateValueAndValidity();
    formControl
      .get('sodium')
      .setValidators([Validators.required, numberChecker()]);
    formControl.get('sodium').updateValueAndValidity();
  }

  removeHomeChefValidators(formControl: AbstractControl): void {
    formControl.get('fat').clearValidators();
    formControl.get('fat').updateValueAndValidity();
    formControl.get('carbohydrate').clearValidators();
    formControl.get('carbohydrate').updateValueAndValidity();
    formControl.get('protein').clearValidators();
    formControl.get('protein').updateValueAndValidity();
    formControl.get('sodium').clearValidators();
    formControl.get('sodium').updateValueAndValidity();
  }

  addHelloFreshValidators(formControl: AbstractControl): void {
    formControl
      .get('sugar')
      .setValidators([Validators.required, numberChecker()]);
    formControl.get('sugar').updateValueAndValidity();
    formControl
      .get('saturatedFat')
      .setValidators([Validators.required, numberChecker()]);
    formControl.get('saturatedFat').updateValueAndValidity();
    formControl
      .get('cholesterol')
      .setValidators([Validators.required, numberChecker()]);
    formControl.get('cholesterol').updateValueAndValidity();
    formControl
      .get('fiber')
      .setValidators([Validators.required, numberChecker()]);
    formControl.get('fiber').updateValueAndValidity();
  }

  removeHelloFreshValidators(formControl: AbstractControl): void {
    formControl.get('sugar').clearValidators();
    formControl.get('sugar').updateValueAndValidity();
    formControl.get('saturatedFat').clearValidators();
    formControl.get('saturatedFat').updateValueAndValidity();
    formControl.get('cholesterol').clearValidators();
    formControl.get('cholesterol').updateValueAndValidity();
    formControl.get('fiber').clearValidators();
    formControl.get('fiber').updateValueAndValidity();
  }
}
