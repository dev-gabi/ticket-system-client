import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CanDeactivateGuard } from '../auth/guards/can-deactivate.guard';
import { NewTicketComponent } from '../tickets/new-ticket/new-ticket.component';
import { TicketListComponent } from '../tickets/ticket-list/ticket-list.component';
import { TicketComponent } from '../tickets/ticket/ticket.component';
import { CustomerDetailsEditComponent } from './customer-details/customer-details-edit/customer-details-edit.component';
import { CustomerPanelComponent } from './customer-panel/customer-panel.component';

const routes: Routes = [
  {
    path: '', component: CustomerPanelComponent, canActivate: [AuthGuard],  
    children: [
      { path: 'edit', component: CustomerDetailsEditComponent, canDeactivate: [CanDeactivateGuard] },
      {
        path: 'tickets', component: TicketListComponent, children: [
            { path: 'new', component: NewTicketComponent, pathMatch: 'full' },
          { path: ':id', component: TicketComponent}
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
