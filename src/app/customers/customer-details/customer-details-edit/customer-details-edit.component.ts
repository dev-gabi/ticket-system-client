import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CanComponentDeactivate } from '../../../auth/guards/can-deactivate.guard';
import { CustomersService } from '../../customers.service';
import { Customer } from '../../models/customer.model';


@Component({
  selector: 'app-customer-details-edit',
  templateUrl: './customer-details-edit.component.html'
})
export class CustomerDetailsEditComponent implements OnInit, OnDestroy, CanComponentDeactivate
{
  constructor(private router: Router, private customerService: CustomersService) { }

  customer: Customer;
  editSub: Subscription;
  submitEditSub: Subscription;
  editForm: FormGroup;
  confirmQuesion = "Are you sure you want to discard the changes you have made?";
  isConfirmBoxOpen = false;
  allowNavigateAway = false;
  changesSaved = false;
  message: string;

  ngOnInit(): void
  {
    this.customer = this.customerService.customer;

    this.editSub = this.customerService.selectedCustomer.subscribe((cus: Customer) =>
    {
      this.customer = cus;
    });
    this.initForm();
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
    this.submitEditSub = this.customerService.editCustomer(editedCustomer);
    this.router.navigate(['customers']);
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
    this.editSub.unsubscribe();
    if (this.submitEditSub) {
      this.submitEditSub.unsubscribe();
    }
  }
}
