import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { AuthUser } from '../../auth/models/auth-user.model';
import { TicketService } from '../ticket.service';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html'
    })

export class NewTicketComponent implements OnInit, OnDestroy
{
  user: AuthUser;
  imageFile: File;
  errorMessage: string;
  categories: string[];
  categoriesSub: Subscription;

  constructor(private ticketService: TicketService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void
  {
    this.user = this.authService.user.value;
    this.categoriesSub = this.ticketService.getCategories().subscribe(
      (categories: string[]) => { this.categories = categories; }
    );
  }

  setFile(fileOutput:File)
  {
    this.imageFile = fileOutput;
  }

  onSubmit(form: NgForm)
  {
    this.ticketService.addNew({ title: form.value.title, message: form.value.initialReply, category: form.value.category , image: this.imageFile }).subscribe(
      () =>
      {
        this.router.navigate(['/customers/tickets']);
      },
      error => this.errorMessage
    );
  
  }
  ngOnDestroy(): void
  {
    this.categoriesSub.unsubscribe();
  }
}
