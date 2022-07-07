import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CustomersService } from '../customers.service';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDetailsComponent implements OnInit
{

  constructor(private route: ActivatedRoute, private router: Router,
    private customerService: CustomersService) { }

  customer$: Observable<Customer>;

  ngOnInit(): void
  {
    this.customer$ = this.customerService.customer$;
  }

  onEdit()
  {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
}
