import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppChartsModule } from '../charts/app-charts.module';
import { SharedModule } from '../shared/shared.module';
import { TicketsModule } from '../tickets/tickets.module';
import { StatsComponent } from './stats/stats.component';
import { SupportRoutingModule } from './support-routing.module';
import { SupporterDetailsComponent } from './supporter-details/supporter-details.component';
import { SupporterEditComponent } from './supporter-details/supporter-edit/supporter-edit.component';

@NgModule({
  declarations: [
    StatsComponent,
    SupporterDetailsComponent,
    SupporterEditComponent
  ],
  imports: [
    SupportRoutingModule,
    FormsModule,
    TicketsModule,
    SharedModule,
    AppChartsModule

  ]
})
export class SupportModule { }
