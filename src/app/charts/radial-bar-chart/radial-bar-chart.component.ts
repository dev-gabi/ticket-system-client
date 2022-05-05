import { Component, Input, ViewChild } from '@angular/core';
import { Helpers } from 'src/app/helpers';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexLegend,
  ApexResponsive,
  ChartComponent
} from "ng-apexcharts";

import { TopPerformance } from '../../support/models/top-employee-performance-response.model';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive:  ApexResponsive[];
};

@Component({
  selector: 'app-radial-bar-chart',
  templateUrl: './radial-bar-chart.component.html',
  styleUrls: ['./radial-bar-chart.component.css']
})
export class RadialBarChartComponent  {

  public chartOptions: Partial<ChartOptions>;
  @Input('performance') performance: TopPerformance;
  constructor() { }

  @ViewChild("chart") chart: ChartComponent;
  ngOnInit(): void
  {
    const valueToPercent = (val: number) => (val * 100) / this.performance.maxValue;
    const precentToValue = (val: number): string => ((val * this.performance.maxValue) / 100).toString();
    let ticketsClosedSeries: number[] = Helpers.extractArrayOfProp(this.performance.employeeStats, 'ticketsClosed');
    ticketsClosedSeries = ticketsClosedSeries.map(t => t = valueToPercent(t));
    let userNameSeries = Helpers.extractArrayOfProp(this.performance.employeeStats, 'userName');
    this.chartOptions = {
      //  series: [valueToPercent(this.performance.employeeStats[0].ticketsClosed), valueToPercent(this.performance.employeeStats[1].ticketsClosed)],
      series: ticketsClosedSeries,
      chart: {
        height: 240,
        type: "radialBar"
      },
      plotOptions: {

        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent"
          },
          dataLabels: {
            name: {
              show: true
            },
            value: {
              show: true,
              formatter: precentToValue,//uncomment this line will display percantage
            }
          }
        }
      },
      colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5", "#036496"],
      labels: userNameSeries,
      legend: {
        show: true,
        floating: true,
        fontSize: "16px",
        position: "right",
        offsetX: 50,
        offsetY: 50,
        labels: {
          useSeriesColors: true,
        },
        formatter: function (seriesName: any, opts: any)
        {
          return seriesName + ":  " + precentToValue(opts.w.globals.series[opts.seriesIndex])
        },
        ////display percentage
        //formatter: function (seriesName: any, opts: any)
        //{
        //  return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        //},
        itemMargin: {
          horizontal: 3
        }
      },
      responsive: [
        {
          breakpoint: 1200,
          options: {
            legend: {
              show: false
            },
          }
        }]
      
    };

  }
}
