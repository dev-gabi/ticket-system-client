import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GeneralStats } from '../../charts/general-stats.model';
import { EmployeeService } from '../../employee.service';
import { TopPerformance } from '../../support/models/top-employee-performance-response.model';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit, OnDestroy
{

  constructor(private router: Router, private route: ActivatedRoute, private employeeService: EmployeeService, private cdr: ChangeDetectorRef) { }

  supporterRole = environment.roles.supporter;
  error: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isSupportersFetched = false;
  topPerformance:TopPerformance = null;
  generalStats: GeneralStats;

  ngOnInit(): void
  {
    this.employeeService.getGeneralMonthlyStats().pipe(
      takeUntil(this.destroy$)).subscribe(
        stats =>
        {
          this.generalStats = stats;
          this.cdr.detectChanges();
        }
    );

    this.employeeService.error.pipe(
      takeUntil(this.destroy$)).subscribe(
      (error: string) =>
      {
        this.error = error;
      }
    );
    this.employeeService.supporter$.pipe(
      takeUntil(this.destroy$)).subscribe(
      supporter =>
      {
        if (supporter)
        this.router.navigate(['supporters', supporter.name], { relativeTo: this.route });
      },
      error =>
      {
        this.error = error;
      }
    );
    this.employeeService.getTopPerformance().pipe(
      takeUntil(this.destroy$)).subscribe(
        (performance: TopPerformance) =>
        {
          this.topPerformance = performance;
          this.cdr.detectChanges();
        },
      error =>
      {
        this.error = error;
      }
    );

  }

  ngOnDestroy(): void
  {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
