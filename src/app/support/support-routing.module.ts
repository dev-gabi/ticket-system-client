import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormDeactivateGuard } from '../auth/guards/form-deactivate.guard';
import { TicketListComponent } from '../tickets/ticket-list/ticket-list2.component';
import { AddReplyComponent } from '../tickets/ticket/add-reply/add-reply.component';
import { TicketComponent } from '../tickets/ticket/ticket.component';
import { StatsComponent } from './stats/stats.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'tickets', component: TicketListComponent, children: [
          {
            path: ':id', component: TicketComponent, children: [
              { path: 'add-reply', component: AddReplyComponent, canDeactivate: [FormDeactivateGuard] }
            ]
          }
        ]
      },
    ]
  },
  { path: 'stats', component: StatsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportRoutingModule { }
