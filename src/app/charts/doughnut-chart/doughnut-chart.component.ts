import { Component, ViewChild, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";
import
  {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexPlotOptions,
    ApexChart,
    ApexLegend,
    ApexDataLabels
  } from "ng-apexcharts";
import { GeneralStats } from '../../admin/models/general-stats.model';


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  plotOptions: ApexPlotOptions;
  chart: ApexChart;
  legend: ApexLegend,
  responsive: ApexResponsive[];
  labels: any;
  colors: string[];
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class  doughnutChartComponent implements OnInit {

  constructor( private cdr: ChangeDetectorRef) { }
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input('stats') stats: GeneralStats;
  totalSum: number;
  ngOnInit(): void
  {
    this.totalSum = this.stats.totalClosedTickets + this.stats.totalReplies;

    const precentToValue = (val: number) => Math.trunc((val * this.totalSum) / 100);

    this.chartOptions = {
      series: [this.stats.totalClosedTickets, this.stats.totalReplies],
      colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5", "#036496"],
      chart: {
        type: "donut",
        height: 220,
        offsetY:40
      },

      dataLabels: {
        enabled: true,
        formatter: precentToValue,
        style: {
          fontSize: "14px",
          colors: ["#black"]
        },
        dropShadow: {
          enabled: false
        }
      },
      labels: ["Closed Tickets", "Total Replies"],
      legend: {
        show: true,
        floating: true,
        fontSize: "16px",
        position: "right",
        offsetX: 30,
        offsetY: 10,
        labels: {
          useSeriesColors: true,
        }
      },
        responsive: [
          {
            breakpoint: 1200,
            options: {
              chart: {
                width: "100%",
                offsetY: 0
              },
              legend: {
                show: false
              }
            }
          }
        ]
    };
    this.cdr.detectChanges();
  }
}
