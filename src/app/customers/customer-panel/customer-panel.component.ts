import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { CustomersService } from '../customers.service';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-customer-panel',
  templateUrl: './customer-panel.component.html'
})
export class CustomerPanelComponent implements OnInit, OnDestroy
{

  customer: Customer;
  customerChangedSub: Subscription;
  getCustomerSub: Subscription;
  displayTicketList = false;
  errorMessage: string;
  constructor(private authService: AuthService, private customerService: CustomersService)
  {  }

  ngOnInit(): void
  {
    const id = this.authService.user.value.id;
    this.getCustomerSub = this.customerService.getCustomerById(id).subscribe(
      (customer: Customer) =>
      {
        this.customer = customer
      }
    );

    this.customerChangedSub = this.customerService.selectedCustomer.subscribe(changedCustomer =>
    {
      this.customer = changedCustomer;
    });
   
  }
  onHandleError()
  {
    this.errorMessage = null;
  }
  ngOnDestroy(): void
  {
    this.getCustomerSub.unsubscribe();
    this.customerChangedSub.unsubscribe();
  }
}
