import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { AuthUser } from '../../auth/models/auth-user.model';
import { TicketService2 } from '../ticket.service2';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
    })

export class NewTicketComponent implements OnInit

{
  user: AuthUser;
  imageFile: File;
  message: string = null;
  categories$: Observable<string[]>;


  constructor(private ticketService: TicketService2, private authService: AuthService, private router: Router) { }

  ngOnInit(): void
  {
    this.user = this.authService.user.value;
    this.categories$ = this.ticketService.categories$;
  }

  setFile(fileOutput:File)
  {
    this.imageFile = fileOutput;
  }

  onSubmit(form: NgForm)
  {
    this.ticketService.addNew({ title: form.value.title, message: form.value.initialReply, category: form.value.category, image: this.imageFile })
      .subscribe(
      () =>
      {
        this.router.navigate(['/customers/tickets']);
      },
      error => this.message = error
    );
  
  }
}
