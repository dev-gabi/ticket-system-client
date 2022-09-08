import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import ApexCharts from 'apexcharts';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { SupporterStats } from '../../support/models/supporter-stats-data.model';
import { Supporter } from '../../support/models/supporter.model';
import { SupportService } from '../../support/support.service';
import { DestroyPolicy } from '../../utils/destroy-policy';


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent extends DestroyPolicy 
{

  constructor(private supportService: SupportService, private renderer: Renderer2,
    private cdr: ChangeDetectorRef,) { super(); }


  @ViewChild('chartContainer') container: ElementRef;
  supporter$: Observable<Supporter> = this.supportService.selectActiveSupporter();

  ngAfterViewInit()
  {
    this.supporter$.pipe(
     
      map(supporter =>
      {
        if (supporter) return supporter.stats;
        return [];
      }),
      takeUntil(this.destroy$)
    ).subscribe(
      stats =>
      {
        this.renderChart(stats);
        this.cdr.markForCheck();
      }
    );
   
  }
  renderChart(stats: SupporterStats[])
  {
    this.renderer.setProperty(this.container.nativeElement, 'innerHTML', '');
    var options = {
      chart: {
        type: "area",
        height: 300,
        foreColor: "#999",
        stacked: true,
        dropShadow: {
          enabled: true,
          enabledSeries: [0],
          top: -2,
          left: 2,
          blur: 5,
          opacity: 0.06
        }
      },
      colors: ['#00E396', '#0090FF'],
      stroke: {
        curve: "smooth",
        width: 3
      },
      dataLabels: {
        enabled: false
      },

      series: [{
        name: 'Replies',
        //  data: [{ x: '05/06/2014', y: 54 }, { x: '05/08/2014', y: 17 },  { x: '05/28/2014', y: 26 }]
        data: this.createSeriesForReplies(stats)
      },
      {
        name: 'Tickets Closed',
        //    data: [{ x: '05/06/2014', y: 56 }, { x: '05/08/2014', y: 18 }, { x: '05/28/2014', y: 29 }]
        data: this.createSeriesForTickets(stats)
      }],
      xaxis: {
        type: "datetime",
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: true
        }
      },
      markers: {
        size: 0,
        strokeColor: "#fff",
        strokeWidth: 3,
        strokeOpacity: 1,
        fillOpacity: 1,
        hover: {
          size: 6
        }
      },

      yaxis: {
        labels: {
          offsetX: 14,
          offsetY: -5
        },
        tooltip: {
          enabled: true
        }
      },
      grid: {
        padding: {
          left: -5,
          right: 5
        }
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy"
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left'
      },
      fill: {
        type: "solid",
        fillOpacity: 0.7
      }
    };

    var chart = new ApexCharts(this.container.nativeElement, options);

    chart.render();
  }
  createSeriesForTickets(userData: SupporterStats[]):any
  {
    let series: any = [];
    if (userData) {
      userData.forEach(d =>
      {
        const date = d.date;
        const ticketsClosed = d.ticketsClosed;
        series.push([date, ticketsClosed]);
      })
    }
    return series;
  }
  createSeriesForReplies(userData: SupporterStats[]): any
  {
    let series: any = [];
    if (userData != null) {
      userData.forEach(d =>
      {
        const date = d.date;
        const replies = d.replies;
        series.push([date, replies]);
      })
    }
    return series;
  }
}
