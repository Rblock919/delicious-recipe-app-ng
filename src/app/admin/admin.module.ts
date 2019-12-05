import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminService } from './services/admin.service';
import { UserResolverService } from './services/user-resolver.service';
import { UnapprovedRecipeResolverService } from './services/unapproved-recipe-resolver.service';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    AdminRoutingModule.components
  ],
  providers: [
    AdminService,
    UserResolverService,
    UnapprovedRecipeResolverService
  ]
})
export class AdminModule { }
