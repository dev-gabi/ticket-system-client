import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormDeactivateGuard } from '../auth/guards/form-deactivate.guard';
import { NewTicketComponent } from '../tickets/new-ticket/new-ticket.component';
import { TicketListComponent } from '../tickets/ticket-list/ticket-list2.component';
import { AddReplyComponent } from '../tickets/ticket/add-reply/add-reply.component';
import { TicketComponent } from '../tickets/ticket/ticket.component';
import { CustomerDetailsEditComponent } from './customer-details/customer-details-edit/customer-details-edit.component';
import { CustomerPanelComponent } from './customer-panel/customer-panel.component';

const routes: Routes = [
  {
    path: '', component: CustomerPanelComponent, 
    children: [
      {
        path: 'tickets', component: TicketListComponent, children: [
         
          {
            path: ':id', component: TicketComponent, children: [
              { path: 'add-reply', component: AddReplyComponent, canDeactivate: [FormDeactivateGuard] }
            ]
          },
          { path: 'new', component: NewTicketComponent, pathMatch: 'full', canDeactivate: [FormDeactivateGuard] }
        ]
      },
      { path: 'edit', component: CustomerDetailsEditComponent, canDeactivate: [FormDeactivateGuard] },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
