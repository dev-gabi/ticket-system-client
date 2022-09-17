import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefreshTokenComponent } from '../auth/auth/register/refresh-token/refresh-token.component';
import { RegisterComponent } from '../auth/auth/register/register.component';
import { AdminAuthGuard } from '../auth/guards/admin.guard';
import { FormDeactivateGuard } from '../auth/guards/form-deactivate.guard';
import { SupporterDetailsComponent } from '../support/supporter-details/supporter-details.component';
import { SupporterEditComponent } from '../support/supporter-details/supporter-edit/supporter-edit.component';
import { AdminComponent } from './admin/admin.component';

import { SupporterSearchComponent } from './supporter-search/supporter-search';


const routes: Routes = [
  {
    path: '', component: AdminComponent, canActivate: [AdminAuthGuard], children: [
      {

        path: 'supporters', children: [
          { path: 'search', component: SupporterSearchComponent },
              {
                path: ':name', component: SupporterDetailsComponent,  children: [
                  { path: 'edit', component: SupporterEditComponent, canDeactivate: [FormDeactivateGuard] },
                ]
              }
            ]
          },
          { path: 'register', component: RegisterComponent },
          { path: 'refresh-token', component: RefreshTokenComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
