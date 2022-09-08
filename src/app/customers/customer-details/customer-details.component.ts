import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
  isLoggingOut = false;

  ngAfterViewInit(): void
  {
    this.subscribeIsLoggingOut();

    if (!this.isLoggingOut) {
      this.checkIfCustomerLoaded();
    }
  
    this.error$ = this.customerService.error$;
  }

  subscribeIsLoggingOut()
  {
    this.authService.loggingOut.pipe(takeUntil(this.destroy$))
      .subscribe(
      () =>  this.isLoggingOut = true 
    );
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
