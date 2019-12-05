import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ApproveRecipeDetailComponent } from './approve-recipe-detail/approve-recipe-detail.component';
import { ApproveRecipeListComponent } from './approve-recipe-list/approve-recipe-list.component';
import { EditRecipeListComponent } from './edit-recipe-list/edit-recipe-list.component';
import { EditUserListComponent } from './edit-user-list/edit-user-list.component';
import { AdminService } from '../services/api/admin.service';
import { RecipeResolverService } from '../services/resolvers/recipe-resolver.service';
import { UserResolverService } from '../services/resolvers/user-resolver.service';
import { UnapprovedRecipeResolverService } from '../services/resolvers/unapproved-recipe-resolver.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'editRecipeList',
        component: EditRecipeListComponent,
        resolve: { resolvedData: RecipeResolverService },
        data: { multipleRecipes: true }
      },
      {
        path: 'approve',
        component: ApproveRecipeListComponent,
        resolve: { resolvedData: UnapprovedRecipeResolverService },
        data: { multipleRecipes: true }
      },
      {
        path: 'approve/:id',
        component: ApproveRecipeDetailComponent,
        resolve: { resolvedData: UnapprovedRecipeResolverService },
        data: { multipleRecipes: false }
      },
      {
        path: 'editUserList',
        component: EditUserListComponent,
        resolve: { resolvedData: UserResolverService },
        data: { multipleUsers: true}
      },
      {
        path: '',
        redirectTo: '/home'
      }
    ]),
    ReactiveFormsModule
  ],
  declarations: [
    EditUserListComponent,
    EditRecipeListComponent,
    ApproveRecipeListComponent,
    ApproveRecipeDetailComponent
  ],
  providers: [
    AdminService,
    UserResolverService,
    UnapprovedRecipeResolverService
  ]
})
export class AdminModule { }
