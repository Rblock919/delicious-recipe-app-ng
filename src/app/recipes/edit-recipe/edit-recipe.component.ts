import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder,
  Validators, AbstractControl, ValidatorFn,
  FormArray } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { RecipeApiService } from 'src/app/core/services/api/recipe-api.service';
import { IRecipe, IRecipeResolved } from 'src/app/models/recipe.model';
import { TOASTR_TOKEN, Toastr } from '../../core/services/toastr.service';

function numberChecker(): ValidatorFn {

  return (c: AbstractControl): { [key: string]: boolean} | null => {

    const isNotNumber = isNaN(c.value);

    if (c.dirty && isNotNumber && c.value !== '') {
      return {numberType: true};
    }

    return null;
  };
}

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss']
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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiService: RecipeApiService,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private fb: FormBuilder) { }

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
        sodium: ['', [Validators.required, numberChecker()]]
      }),
      imgDir: ['', Validators.required]
    });

    // console.log('right before watchProducer');
    // this.watchProducer();
    // this.watchImageUrl();

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
          this.preCook.at(preCookCounter).get('body').clearValidators();
          this.preCook.at(preCookCounter).get('body').updateValueAndValidity();
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
      this.preCook.at(counter).get('body').setValidators(Validators.required);
      this.preCook.at(counter).get('body').updateValueAndValidity();
      counter++;
    }
  }

  watchImageUrl(): void {
    const imageControl = this.recipeForm.get('imgDir');
    this.imgUrlSub = imageControl.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
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
      console.log('user submitting blue apron recipe. Clearing preCook array...');
      this.clearFormArray(this.preCook);
      if (!this.blueApronNutritionFlag) {
        console.log('saving BA form that doesnt provide nutrition info');
        const nutritionControl = this.recipeForm.get('nutrition');
        nutritionControl.get('fat').patchValue('');
        nutritionControl.get('carbohydrate').patchValue('');
        nutritionControl.get('protein').patchValue('');
        nutritionControl.get('sodium').patchValue('');
        nutritionControl.get('sugar').patchValue('');
        nutritionControl.get('saturatedFat').patchValue('');
        nutritionControl.get('cholesterol').patchValue('');
        nutritionControl.get('fiber').patchValue('');
      }
    }

    if (this.recipeProducer === 'Home Chef' && this.recipeForm.get('nutrition.sugar').value !== '') {
      const nutritionControl = this.recipeForm.get('nutrition');
      nutritionControl.get('sugar').patchValue('');
      nutritionControl.get('saturatedFat').patchValue('');
      nutritionControl.get('cholesterol').patchValue('');
      nutritionControl.get('fiber').patchValue('');
    }

    // console.log('recipe form value: ' + JSON.stringify(this.recipeForm.value));
    // return;

    let formRecipe: IRecipe;
    formRecipe = this.recipeForm.value;
    // formRecipe.nutritionValues = this.recipeForm.get('nutrition').value;


    // user is adding new recipe
    if (this.id === '0') {
      formRecipe.favoriters = [];
      formRecipe.raters = {} as Map<number, number>;
      this.apiService.submitRecipeForApproval(formRecipe).subscribe(res => {
        // console.log('response: ' + res.id);
        this.submitted = true;
        this.toastr.success('Recipe Submitted for Approval!');
        this.router.navigate(['/recipe/submitted']);
      }, err => {
        this.toastr.error('Error submitting recipe. Check fields and try again');
        console.log('ERROR CREATING RECIPE: ' + JSON.stringify(err));
      });

    } else { // user is editing current recipe

      formRecipe._id = this.id;
      formRecipe.favoriters = this.recipe.favoriters;
      formRecipe.raters = this.recipe.raters;
      this.apiService.updateRecipe(formRecipe).subscribe(res => {
        console.log('res on updating: ' + res);
        this.submitted = true;
        this.toastr.success('Recipe Successfully Updated!');
        this.router.navigate(['recipe', this.id]);
      }, err => {
        this.toastr.error('Error Updating Recipe');
        console.log('ERROR UPDATING RECIPE: ' + JSON.stringify(err));
      });

    }

  }


  getRecipeInfo(): void {
    if (this.id === '0') { // ading a recipe instead of editing one
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
          sodium: ['', [Validators.required, numberChecker()]]
        }),
        imgDir: ['', Validators.required]
      });

      this.recipe = {} as IRecipe;
      this.imageDir = '';
      this.watchImageUrl();
      this.watchProducer();
    } else { // editing a recipe

        const resolvedData: IRecipeResolved = this.route.snapshot.data.resolvedData;

        if (resolvedData.error) {
          console.error(`Error in edit recipe ${resolvedData.error}`);
          this.router.navigate(['error']);
        }

        this.watchImageUrl();
        this.watchProducer();

        this.recipe = resolvedData.recipe;

        if (this.ingredients) {
          this.ingredients.reset();
        }
        if (this.steps) {
          this.steps.reset();
        }

        this.blueApronNutritionFlag = (this.recipe.producer === 'Blue Apron' && !!this.recipe.nutritionValues.fat);

        let ingredientCounter = 0;
        let stepCounter = 0;
        let preCookCounter = 0;

        this.recipe.ingredients.forEach(element => {
          const choppedElement = element.split(' | ');
          const ingredientName = choppedElement[0];
          const ingredientAmount = choppedElement[1];
          // console.log('ingredients array: ' + element);
          this.ingredients.push(this.buildIngredient());
          this.ingredients.at(ingredientCounter).patchValue({
            name: ingredientName,
            amount: ingredientAmount
          });
          ingredientCounter++;
        });

        this.recipe.preCook.forEach(element => {
          this.preCook.push(this.buildPreCook());
          this.preCook.at(preCookCounter).patchValue({
            body: element
          });
          preCookCounter++;
        });

        this.recipe.steps.forEach(step => {
          // console.log('Step ' + (stepCounter + 1) + ': ' + step.name + ' - ' + step.body);
          this.steps.push(this.buildStep());
          this.steps.at(stepCounter).patchValue({
            name: step.name,
            body: step.body
          });
          stepCounter++;
        });

        this.imageDir = this.recipe.imgDir;

        this.recipeForm.patchValue({
          producer: this.recipe.producer,
          title: this.recipe.title,
          nutrition: this.recipe.nutritionValues,
          imgDir: this.recipe.imgDir
        });
      // });
    }

  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  buildPreCook(): FormGroup {
    return this.fb.group({
      body: ['', Validators.required]
    });
  }

  buildIngredient(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      amount: ['', Validators.required]
      // amountFor2: ['', Validators.required],
      // amountFor4: ['', Validators.required]
    });
  }

  buildStep(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      body: ['', Validators.required]
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
    formControl.get('fat').setValidators([Validators.required, numberChecker()]);
    formControl.get('fat').updateValueAndValidity();
    formControl.get('carbohydrate').setValidators([Validators.required, numberChecker()]);
    formControl.get('carbohydrate').updateValueAndValidity();
    formControl.get('protein').setValidators([Validators.required, numberChecker()]);
    formControl.get('protein').updateValueAndValidity();
    formControl.get('sodium').setValidators([Validators.required, numberChecker()]);
    formControl.get('sodium').updateValueAndValidity();
  }

  removeHomeChefValidators(formControl: AbstractControl): void {
    formControl.get('fat').clearValidators();
   // formControl.get('fat').patchValue('');
    formControl.get('fat').updateValueAndValidity();
    formControl.get('carbohydrate').clearValidators();
   // formControl.get('carbohydrate').patchValue('');
    formControl.get('carbohydrate').updateValueAndValidity();
    formControl.get('protein').clearValidators();
   // formControl.get('protein').patchValue('');
    formControl.get('protein').updateValueAndValidity();
    formControl.get('sodium').clearValidators();
   // formControl.get('sodium').patchValue('');
    formControl.get('sodium').updateValueAndValidity();
  }

  addHelloFreshValidators(formControl: AbstractControl): void {
    formControl.get('sugar').setValidators([Validators.required, numberChecker()]);
    formControl.get('sugar').updateValueAndValidity();
    formControl.get('saturatedFat').setValidators([Validators.required, numberChecker()]);
    formControl.get('saturatedFat').updateValueAndValidity();
    formControl.get('cholesterol').setValidators([Validators.required, numberChecker()]);
    formControl.get('cholesterol').updateValueAndValidity();
    formControl.get('fiber').setValidators([Validators.required, numberChecker()]);
    formControl.get('fiber').updateValueAndValidity();
  }

  removeHelloFreshValidators(formControl: AbstractControl): void {
    formControl.get('sugar').clearValidators();
   //  formControl.get('sugar').patchValue('');
    formControl.get('sugar').updateValueAndValidity();
    formControl.get('saturatedFat').clearValidators();
   //  formControl.get('saturatedFat').patchValue('');
    formControl.get('saturatedFat').updateValueAndValidity();
    formControl.get('cholesterol').clearValidators();
   //  formControl.get('cholesterol').patchValue('');
    formControl.get('cholesterol').updateValueAndValidity();
    formControl.get('fiber').clearValidators();
   //  formControl.get('fiber').patchValue('');
    formControl.get('fiber').updateValueAndValidity();
  }

}
