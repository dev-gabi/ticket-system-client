import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeAuthGuard } from '../auth/guards/employee.guard';
import { TicketComponent } from '../tickets/ticket/ticket.component';
import { TicketResolver } from '../tickets/tickets.resolver';
import { StatsComponent } from './stats/stats.component';
import { SupportComponent } from './support/support.component';



const routes: Routes = [
  {
    path: '', component: SupportComponent,
    canActivate: [EmployeeAuthGuard],
    resolve: { tickets: TicketResolver },
    children: [    
      { path: 'tickets', children: [
                  { path: ':id', component: TicketComponent }
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
