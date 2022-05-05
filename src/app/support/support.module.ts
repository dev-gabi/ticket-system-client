import { NgModule } from '@angular/core';

import { SupportRoutingModule } from './support-routing.module';
import { SupportComponent } from './support/support.component';
import { TicketsModule } from '../tickets/tickets.module';
import { SharedModule } from '../shared/shared.module';
import { StatsComponent } from './stats/stats.component';
import { AppChartsModule } from '../charts/app-charts.module';


@NgModule({
  declarations: [
    SupportComponent,
    StatsComponent
  ],
  imports: [
    SupportRoutingModule,
    TicketsModule,
    SharedModule,
    AppChartsModule

  ]
})
export class SupportModule { }
