import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CanComponentDeactivate } from '../../../../auth/guards/can-deactivate.guard';
import { EmployeeService } from '../../../../employee.service';
import { Supporter } from '../../../../support/models/supporter.model';

@Component({
  selector: 'app-supporter-edit',
  templateUrl: './supporter-edit.component.html',
  styleUrls: ['./supporter-edit.component.css']
})
export class SupporterEditComponent implements OnInit, OnDestroy, CanComponentDeactivate
{

  constructor(private route: ActivatedRoute, private router: Router, private employeeService: EmployeeService) { }

  id: string;
  supporter: Supporter;
  supporterSub: Subscription;
  editForm: FormGroup;
  isConfirmBoxOpen = false;
  allowNavigateAway = false;
  changesSaved = false;
  confirmQuesion = "Cancel changes for this user?";
  error: string;
  errorSub: Subscription;

  ngOnInit(): void
  {

    this.supporterSub = this.employeeService.supporter.subscribe(
      (employee: Supporter) =>
      {
        this.supporter = employee;      
      }
    );
    this.errorSub = this.employeeService.error.subscribe(
      (error: string) =>
      {
        this.error = error;
      }
    );
     this.initForm();
  }
  initForm()
  {
    let name = this.supporter.name;
    let email = this.supporter.email;
    let isActive = this.supporter.isActive;
    this.editForm = new FormGroup({
      'name': new FormControl(name, [Validators.required, Validators.minLength(2)]),
      'email': new FormControl(email, [Validators.required, Validators.email]),
      'isActive': new FormControl(isActive)
    })
  }
  onSubmit()
  {
    this.changesSaved = true;
    const editedSupporter = new Supporter(
      this.supporter.id,
      this.editForm.get('name').value,
      this.supporter.role,
      this.editForm.get('email').value,
      this.editForm.get('isActive').value,
      this.supporter.registrationDate
    );
    this.employeeService.editSupporter(editedSupporter).subscribe(
    
    );
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  onCancelEdit()
  {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  onConfirm()
  {
    this.isConfirmBoxOpen = false;
    this.allowNavigateAway = true;
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> | UrlTree
  {
    if (this.changesSaved) { return true; }
    if (this.editForm.get('name').value != this.supporter.name ||
      this.editForm.get('email').value != this.supporter.email ||
      this.editForm.get('isActive').value != this.supporter.isActive){
      this.isConfirmBoxOpen = true;
      return this.allowNavigateAway;
    } else {
      return true;
    }
  }
  ngOnDestroy()
  {
    this.supporterSub.unsubscribe();
    this.errorSub.unsubscribe();
  }
}
