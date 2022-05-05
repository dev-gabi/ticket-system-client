import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { EmployeeService } from '../../employee.service';
import { SupporterStats } from '../models/supporter-stats-data.model';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit, OnDestroy
{

  constructor(private authService: AuthService, private employeeService: EmployeeService) { }

  userStats: SupporterStats[];
  userSub: Subscription;
  userId: string;


  ngOnInit(): void
  {
    this.userId = this.authService.user.value.id;
    this.userSub = this.employeeService.getEmployeeById(this.userId).subscribe(
      supporter => { this.userStats = supporter.stats }
    );
  }

  ngOnDestroy(): void
  {
    this.userSub.unsubscribe();
  }

}
