import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FormDeactivateGuard } from '../auth/guards/form-deactivate.guard';
import { NewTicketComponent } from '../tickets/new-ticket/new-ticket.component';
import { TicketListComponent } from '../tickets/ticket-list/ticket-list.component';
import { TicketComponent } from '../tickets/ticket/ticket.component';
import { CustomerDetailsEditComponent } from './customer-details/customer-details-edit/customer-details-edit.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomerPanelComponent } from './customer-panel/customer-panel.component';

const routes: Routes = [
  {
    path: '', component: CustomerPanelComponent, canActivate: [AuthGuard],
    children: [

      { path: 'edit', component: CustomerDetailsEditComponent, canDeactivate: [FormDeactivateGuard] },
      {
        path: 'tickets', component: TicketListComponent, children: [
          { path: 'new', component: NewTicketComponent,
            pathMatch: 'full', canDeactivate: [FormDeactivateGuard]},
          { path: ':id', component: TicketComponent }
        ]
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
