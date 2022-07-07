import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, UrlTree } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../auth/auth.service';
import { CanComponentDeactivate } from '../../../auth/guards/can-deactivate.guard';
import { CustomersService } from '../../customers.service';
import { Customer } from '../../models/customer.model';


@Component({
  selector: 'app-customer-details-edit',
  templateUrl: './customer-details-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDetailsEditComponent implements OnInit, OnDestroy, CanComponentDeactivate
{
  constructor(private router: Router, private customerService: CustomersService) { }

  customer$: Observable<Customer>;
  customer: Customer;
  editForm: FormGroup;
  confirmQuesion = "Are you sure you want to discard the changes you have made?";
  isConfirmBoxOpen = false;
  allowNavigateAway = false;
  changesSaved = false;
  message: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void
  {
    this.customer$ = this.customerService.customer$;
    this.customer$.pipe(takeUntil(this.destroy$))
      .subscribe(
        customer =>
        {
          this.customer = customer;
          this.initForm();
        },
        error => { this.message = error });

  }
  initForm()
  {
    this.editForm = new FormGroup({
      'name': new FormControl(this.customer.name, [Validators.required, Validators.minLength(2)]),
      'email': new FormControl(this.customer.email, [Validators.required, Validators.email]),
      'address': new FormControl(this.customer.address, Validators.required),
      'phoneNumber': new FormControl(this.customer.phoneNumber, [Validators.required])
    })
  }
  onSubmit()
  {
    this.changesSaved = true;
    const editedCustomer = new Customer(
      this.customer.id,
      this.editForm.get('name').value,
      this.customer.role,
      this.editForm.get('email').value,
      this.editForm.get('address').value,
      this.editForm.get('phoneNumber').value,     
      true,
      new Date(),
    );

    this.customerService.editCustomer(editedCustomer).pipe(takeUntil(this.destroy$))
      .subscribe(
        customer =>
        {
          this.customer = customer;
          this.router.navigate(['customers']);
        },
        error => { this.message = error }
    );
  }

  onCancelEdit()
  {
    this.router.navigate(['customers']);
  }
  onConfirm()
  {
    this.isConfirmBoxOpen = false;
    this.allowNavigateAway = true;
    this.router.navigate(['customers']);
  }
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> | UrlTree
  {
    if (this.changesSaved) { return true;}
    if (this.editForm.get('name').value != this.customer.name || this.editForm.get('address').value != this.customer.address ||
      this.editForm.get('phoneNumber').value != this.customer.phoneNumber) {
      this.isConfirmBoxOpen = true;
      return this.allowNavigateAway;
    } else {
     return true;
    }

  }
  ngOnDestroy(): void
  {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
