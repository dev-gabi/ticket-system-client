import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { CustomersBase } from '../customers-base';
import { CustomersService } from '../customers.service';
import { Customer } from '../models/customer.model';
import { CustomersQuery } from '../store/customers.query';


@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDetailsComponent extends CustomersBase 
{
  constructor(private route: ActivatedRoute, private router: Router, protected authService: AuthService,
    protected customerService: CustomersService, protected query: CustomersQuery)
  { super(customerService, query, authService); }

  customer$: Observable<Customer> = this.query.selectActive() as Observable<Customer>;
  error$: Observable<string>;
  isEdit = false;

  ngOnInit(): void
  {
      this.checkIfCustomerLoaded();
      this.error$ = this.customerService.error$;
  }


  onEdit()
  {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onCloseAlert()
  {
    this.customerService.clearError();
  }

}
