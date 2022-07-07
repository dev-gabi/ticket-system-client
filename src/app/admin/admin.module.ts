import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppChartsModule } from '../charts/app-charts.module';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing-module';
import { AdminComponent } from './admin/admin.component';
import { SupporterDetailsComponent } from './admin/supporter-details/supporter-details.component';
import { SupporterEditComponent } from './admin/supporter-details/supporter-edit/supporter-edit.component';
import { AuthLogComponent } from './logs/auth-log/auth-log.component';
import { ErrorLogComponent } from './logs/error-log/error-log.component';

import { SupporterSearchComponent } from './supporter-search/supporter-search';





@NgModule({
  declarations: [
    AdminComponent,
    SupporterDetailsComponent,
    SupporterEditComponent,
    ErrorLogComponent,
    SupporterSearchComponent,
    AuthLogComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    AppChartsModule,
    AdminRoutingModule
  ]
})


export class AdminModule { }
