import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CanFormDeactivate } from '../../../auth/guards/form-deactivate.guard';
import { DestroyPolicy } from '../../../utils/destroy-policy';
import { Supporter } from '../../models/supporter.model';
import { SupportersQuery } from '../../store/supporters.query';
import { SupportService } from '../../support.service';


@Component({
  selector: 'app-supporter-edit',
  templateUrl: './supporter-edit.component.html',
  styleUrls: ['./supporter-edit.component.css']
})
export class SupporterEditComponent extends DestroyPolicy implements OnInit, CanFormDeactivate
{

  constructor(private route: ActivatedRoute, private router: Router,
    private supportService: SupportService, private query: SupportersQuery, private cdr: ChangeDetectorRef)
  { super(); }

  id: string;
  supporter: Supporter = this.query.getActive() as Supporter;
  confirmSubject = new Subject<boolean>();
  isConfirmDialogOpen = false;
  isSaved = false;
  error$: Observable<string>;
  @ViewChild('f') form: NgForm;

  ngOnInit(): void
  {
    this.error$ = this.supportService.error$;
    if (this.supporter == undefined) { this.router.navigate(['admin/supporters/search']) }
  }

  onSubmit(editedData: { name: string, email: string, isActive: boolean })
  {
    this.isSaved = true;
    const editedSupporter: Supporter = {
      id: this.supporter.id,
      name: editedData.name,
      role: this.supporter.role,
      email: editedData.email,
      isActive: editedData.isActive,
      registrationDate: this.supporter.registrationDate
    };
    this.supportService.editSupporter(editedSupporter).pipe(takeUntil(this.destroy$)).subscribe(
      () => this.router.navigate(['../'], { relativeTo: this.route })
    );
   
  }
  onCancelEdit()
  {
    this.router.navigate(['../'], { relativeTo: this.route });
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
    this.supportService.clearError();
  }
}
