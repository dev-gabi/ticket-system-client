import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../auth/auth.service';
import { CanFormDeactivate } from '../../../auth/guards/form-deactivate.guard';
import { CustomersBase } from '../../customers-base';
import { CustomersService } from '../../customers.service';
import { Customer } from '../../models/customer.model';
import { CustomersQuery } from '../../store/customers.query';

@Component({
  selector: 'app-customer-details-edit',
  templateUrl: './customer-details-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDetailsEditComponent extends CustomersBase implements OnInit, CanFormDeactivate
{
  constructor(private router: Router, protected customerService: CustomersService,
    protected authService: AuthService, protected query: CustomersQuery, private cdr: ChangeDetectorRef)
  { super(customerService, query, authService); }

  immutableCustomer: Customer;
  customerEdit$: Observable<Customer>;
  isConfirmDialogOpen = false;
  isSaved = false;
  confirmSubject= new Subject<boolean>();
  error$: Observable<string>;
  @ViewChild('f') form: NgForm;

  ngOnInit(): void
  {
    this.error$ = this.customerService.error$;
    this.checkIfCustomerLoaded();
    this.customerEdit$ = this.query.selectActive() as Observable<Customer>;
  }

  onSubmit(formData: {name:string, email:string, address:string, phoneNumber:string})
  {
    this.immutableCustomer = this.query.getActive() as Customer;
    this.isSaved = true;

    const editedCustomer: Customer = {
      id: this.immutableCustomer.id,
      name: formData.name,
      role: this.immutableCustomer.role,
      email: formData.email,
      address: formData.address,
      phoneNumber: formData.phoneNumber,
      isActive: true,
      registrationDate: new Date(),
    };

    this.customerService.editCustomer(editedCustomer).pipe(takeUntil(this.destroy$))
      .subscribe( () =>
        {
          this.router.navigate(['customers']);
        }
    );
  }

  onCancelEdit()
  {
    this.router.navigate(['customers']);
  }

  openConfirmDialog()
  {
    this.isConfirmDialogOpen = true;
    this.cdr.markForCheck();
  }
  onConfirm(isConfirmed: boolean)
  {
    this.confirmSubject.next(isConfirmed);
    this.isConfirmDialogOpen = false;
  }

  onCloseAlert()
  {
    this.customerService.clearError();
  }

}
