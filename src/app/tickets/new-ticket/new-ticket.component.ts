import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CanFormDeactivate } from '../../auth/guards/form-deactivate.guard';
import { DestroyPolicy } from '../../utils/destroy-policy';
import { CategoriesQuery } from '../categories/store/categories-query';
import { Category } from '../models/category.model';
import { TicketService3 } from '../ticket.service3';


@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewTicketComponent extends DestroyPolicy implements OnInit, CanFormDeactivate
{

  constructor(private ticketService: TicketService3,
    private router: Router, private categoriesQuery: CategoriesQuery, private cdr: ChangeDetectorRef, private fb: FormBuilder) { super(); }

  categories$: Observable<Category[]>;
  error$: Observable<string>;
  confirmSubject = new Subject<boolean>();
  isSaved = false;
  isConfirmDialogOpen = false;
  form: FormGroup;

  ngOnInit(): void
  {
    this.categories$ = this.categoriesQuery.selectAll({
      filterBy: cat => cat.name != "All"
    });
    this.error$ = this.ticketService.error$;
    this.setForm();
  }

  setForm()
  {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      message: ['', [Validators.required, Validators.minLength(5)]],
      imageFile: null,
      category: ['', Validators.required]
    })
  }
  openConfirmDialog()
  {
    this.isConfirmDialogOpen = true;
    this.cdr.markForCheck();
  };
  onConfirm(isConfirmed: boolean)
  {
    this.confirmSubject.next(isConfirmed);
    this.isConfirmDialogOpen = false;
  };


  onSubmit()
  {
    console.log(this.form.get('imageFile').value)
    this.isSaved = true;
    this.ticketService.addNew({
      title: this.form.get('title').value,
      message: this.form.get('message').value,
      category: this.form.get('category').value,
      image: this.form.get('imageFile').value
    }).pipe(takeUntil(this.destroy$))
      .subscribe(
        ticket =>
        {
          this.router.navigate(['/customers/tickets', ticket.id]);
        }
      );
  }

  onCloseAlert()
  {
    this.ticketService.clearError();
  }

}
