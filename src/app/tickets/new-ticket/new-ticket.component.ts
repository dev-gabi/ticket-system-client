import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
    private router: Router, private categoriesQuery: CategoriesQuery, private cdr: ChangeDetectorRef) { super(); }


  imageFile: File;
  categories$: Observable<Category[]>;
  error$: Observable<string>;
  confirmSubject = new Subject<boolean>();
  isSaved = false;
  isConfirmDialogOpen = false;
  @ViewChild('f') form: NgForm;

  ngOnInit(): void
  {
    this.categories$ = this.categoriesQuery.selectAll({
      filterBy: cat => cat.name != "All"
    });
    this.error$ = this.ticketService.error$;
  }

  openConfirmDialog()
  {
    this.isConfirmDialogOpen = true;
    this.cdr.markForCheck();
    console.log(this.confirmSubject)
  };
  onConfirm(isConfirmed: boolean)
  {
    console.log("new ticket comp - on Confirm")
    this.confirmSubject.next(isConfirmed);
    this.isConfirmDialogOpen = false;
  };




  setFile(fileOutput:File)
  {
    this.imageFile = fileOutput;
  }

  onSubmit(form: NgForm)
  {
    this.isSaved = true;
    this.ticketService.addNew({
      title: form.value.title,
      message: form.value.initialReply,
      category: form.value.category,
      image: this.imageFile
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
