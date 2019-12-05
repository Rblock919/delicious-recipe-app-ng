import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApproveRecipeDetailComponent } from './approve-recipe-detail/approve-recipe-detail.component';
import { ApproveRecipeListComponent } from './approve-recipe-list/approve-recipe-list.component';
import { EditRecipeListComponent } from './edit-recipe-list/edit-recipe-list.component';
import { EditUserListComponent } from './edit-user-list/edit-user-list.component';
import { RecipeResolverService } from '../core/resolvers/recipe-resolver.service';
import { UserResolverService } from './services/user-resolver.service';
import { UnapprovedRecipeResolverService } from './services/unapproved-recipe-resolver.service';

const routes: Routes = [
  {
    path: 'editRecipeList',
    component: EditRecipeListComponent,
    resolve: { resolvedData: RecipeResolverService },
    data: { multipleRecipes: true, context: 'edit' }
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
    data: { multipleUsers: true }
  },
  {
    path: '',
    redirectTo: '/home'
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule {
  static components = [
    ApproveRecipeDetailComponent,
    ApproveRecipeListComponent,
    EditRecipeListComponent,
    EditUserListComponent
  ];
}
