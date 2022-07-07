import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { EmployeeService } from '../../../employee.service';
import { Supporter } from '../../../support/models/supporter.model';


@Component({
  selector: 'app-supporter-details',
  templateUrl: './supporter-details.component.html',
  styleUrls: ['./supporter-details.component.css']
})
export class SupporterDetailsComponent  {

  constructor(private route: ActivatedRoute, private router: Router, private employeeService: EmployeeService) { }

  supporter$: Observable<Supporter>;

  ngOnInit(): void
  {
    this.supporter$ = this.employeeService.supporter$;
  }

  onEdit()
  {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

}
