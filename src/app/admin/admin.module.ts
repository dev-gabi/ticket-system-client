import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppChartsModule } from '../charts/app-charts.module';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing-module';
import { AdminComponent } from './admin/admin.component';
import { AuthLogComponent } from './logs/auth-log/auth-log.component';
import { ErrorLogComponent } from './logs/error-log/error-log.component';
import { SupporterSearchComponent } from './supporter-search/supporter-search';






@NgModule({
  declarations: [
    AdminComponent,
    ErrorLogComponent,
    SupporterSearchComponent,
    AuthLogComponent
  ],
  imports: [
    SharedModule,
  //  ReactiveFormsModule,
    RouterModule,
    AppChartsModule,
    AdminRoutingModule
  ]
})


export class AdminModule { }
