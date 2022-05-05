import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GeneralStats } from '../../charts/general-stats.model';
import { EmployeeService } from '../../employee.service';
import { TopPerformance } from '../../support/models/top-employee-performance-response.model';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit, OnDestroy
{

  constructor(private router: Router, private route: ActivatedRoute, private employeeService: EmployeeService) { }

  supporterRole = environment.roles.supporter;
  error: string;
  errorSub: Subscription;
  selectedSupporterSub: Subscription;
  generalStatsSub: Subscription;
  performanceSub: Subscription;
  isSupportersFetched = false;
  topPerformance:TopPerformance = null;
  generalStats: GeneralStats;

  ngOnInit(): void
  {
    this.generalStatsSub = this.employeeService.getGeneralMonthlyStats().subscribe(
      stats => { this.generalStats = stats; }
    );

    this.errorSub = this.employeeService.error.subscribe(
      (error: string) =>
      {
        this.error = error;
      }
    );
    this.selectedSupporterSub = this.employeeService.supporter.subscribe(
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
    this.performanceSub = this.employeeService.getTopPerformance().subscribe(
      (performance: TopPerformance) => { this.topPerformance = performance; },
      error =>
      {
        this.error = error;
      }
    );
     
   
  }

  ngOnDestroy(): void
  {
    this.performanceSub.unsubscribe();
    this.errorSub.unsubscribe();
    this.selectedSupporterSub.unsubscribe();
    this.generalStatsSub.unsubscribe();
  }
}
