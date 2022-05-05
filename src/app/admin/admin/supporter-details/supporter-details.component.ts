import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../../employee.service';
import { Supporter } from '../../../support/models/supporter.model';


@Component({
  selector: 'app-supporter-details',
  templateUrl: './supporter-details.component.html',
  styleUrls: ['./supporter-details.component.css']
})
export class SupporterDetailsComponent  {

  constructor(private route: ActivatedRoute, private router: Router, private employeeService: EmployeeService) { }

  supporter: Supporter;
  userSub: Subscription;

  ngOnInit(): void
  {
    this.userSub = this.employeeService.supporter.subscribe(
      employee =>
      {
        this.supporter = employee;
      }
    );
  }

  onEdit()
  {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
  ngOnDestroy()
  {
    this.userSub.unsubscribe();
  }
}
