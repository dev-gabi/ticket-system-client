import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import 'chart.js';

@Component({
  selector: 'app-gradient-chart',
  templateUrl: './gradient-chart.component.html',
  styleUrls: ['./gradient-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GradientChartComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input('opened') opened: number;
  @Input('closed') closed: number;

  constructor() {  }

  ngOnInit(): void
  {
    let ratio = (this.closed / this.opened) * 100;
    isNaN(ratio) ? ratio = 0 : ratio = ratio;
    this.chartOptions = {
      series: [ratio],
      chart: {
        height: 240,
        type: "radialBar",
        background: "transparent"
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 225,
          hollow: {
            margin: 0,
            size: "70%",
            image: undefined,
            position: "front",
            dropShadow: {
              enabled: true,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 0.24
            }
          },
          track: {
            background: "transparent",
            strokeWidth: "67%",
            margin: 0, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 0.35
            }
          },

          dataLabels: {
            show: true,
            name: {
              offsetY: -10,
              show: true,
              color: "#888",
              fontSize: "17px"
            },
            value: {
              formatter: function (val)
              {
                return parseInt(val.toString(), 10).toString();
              },
              color: "#111",
              fontSize: "36px",
              show: true
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: ["#ABE5A1"],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: "round"
      },
      labels: ["Percent"]
    };
  }

}


import
  {
    ApexNonAxisChartSeries,
    ApexPlotOptions,
    ApexChart,
    ApexFill,
    ChartComponent,
    ApexStroke
  } from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
};
