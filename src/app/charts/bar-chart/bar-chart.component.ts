import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import ApexCharts from 'apexcharts';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { EmployeeService } from '../../employee.service';
import { SupporterStats } from '../../support/models/supporter-stats-data.model';
import { Supporter } from '../../support/models/supporter.model';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent implements OnInit, OnDestroy
{

  constructor(private employeeService: EmployeeService, private renderer: Renderer2,
    private cdr: ChangeDetectorRef) { }


  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('chartContainer') container: ElementRef;
  suppoerter$: Observable<Supporter>;

  ngOnInit()
  {
    this.employeeService.setEmployeeObs().pipe(takeUntil(this.destroy$), filter(s=>s!=null)).subscribe();
    this.suppoerter$ = this.employeeService.supporter$;
  }
  ngAfterViewInit()
  {
    this.employeeService.supporter$.pipe(
      takeUntil(this.destroy$),
      map(supporter =>
      {
        if (supporter) return supporter.stats;
        return [];
      })
    ).subscribe(
      stats =>
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
        this.cdr.markForCheck();
      }
    );
   
  }

  createSeriesForTickets(userData: SupporterStats[]):any
  {
    let series:any = [];
    userData.forEach(d =>
    {
      const date = d.date;
      const ticketsClosed = d.ticketsClosed;
      series.push([date, ticketsClosed]);
    })

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
  ngOnDestroy(): void
  {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
