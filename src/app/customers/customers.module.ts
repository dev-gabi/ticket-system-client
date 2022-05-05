import {  HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TicketsModule } from '../tickets/tickets.module';
import { CustomerDetailsEditComponent } from './customer-details/customer-details-edit/customer-details-edit.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomerPanelComponent } from './customer-panel/customer-panel.component';
import { CustomersRoutingModule } from './customers-routing.module';




@NgModule({
  declarations: [
    CustomerPanelComponent,
    CustomerDetailsComponent,
    CustomerDetailsEditComponent
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    CustomersRoutingModule,
    SharedModule,
    TicketsModule
  ]
})
export class CustomersModule { }
