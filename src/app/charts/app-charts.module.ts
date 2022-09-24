import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from "ng-apexcharts";
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { doughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { GradientChartComponent } from './gradient-chart/gradient-chart.component';
import { RadialBarChartComponent } from './radial-bar-chart/radial-bar-chart.component';




@NgModule({
  declarations: [
    BarChartComponent,
    RadialBarChartComponent,
    GradientChartComponent,
    doughnutChartComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,

  ],
  exports: [
    BarChartComponent,
    RadialBarChartComponent,
    GradientChartComponent,
    doughnutChartComponent
  ]
})
export class AppChartsModule { }
