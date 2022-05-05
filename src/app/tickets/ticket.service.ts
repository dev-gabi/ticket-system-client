import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { ApiResponse } from '../auth/models/api-response.model';
import { GetByStringId } from './models/get-by-string-id.model';
import { ReplyImage } from './models/reply-image.model';
import { ReplyResponse } from './models/response/reply-response.model';
import { TicketResponse } from './models/response/ticket-response.model';
import { TicketReply } from './models/ticket-reply.model';
import { Ticket } from './models/ticket.model';


@Injectable({
  providedIn: 'root'
})
export class TicketService 
{
  constructor(private authService: AuthService, private http: HttpClient) { }

  selectedTicket = new Subject<Ticket>();
  updatedTickets = new Subject<Ticket[]>();
  tickets: Ticket[] = [];

  getCategories()
  {
    return this.http.get<string[]>(environment.endpoints.tickets.getCategories);
  }
  fetchAllTickets(role: string): Ticket[]
  {
    if (role === environment.roles.customer) {
      const userId = new GetByStringId(this.authService.user.value.id);
      this.http.post<Ticket[]>(environment.endpoints.tickets.getAllByUserId, userId).subscribe((tickets) =>
      {
        this.tickets = tickets;
        this.updatedTickets.next(tickets);
      }
      );
    } else {
      this.http.get<TicketResponse[]>(environment.endpoints.tickets.getAll)
        .subscribe(
          (tickets: TicketResponse[]) =>
          {
            this.tickets = tickets;
            this.updatedTickets.next(tickets);
          }
        );
    }
    return this.tickets.slice();
  }
  getTicketsByUserId(id: string)
  {
     this.updatedTickets.next(this.tickets.filter(t => t.customerId === id).slice());
  }
  clearTicketsFromMemory()
  {
    this.tickets = [];
  }
  selectTicket(id: number)
  {
    const selected = this.getById(id);
    this.selectedTicket.next(selected);
  }

  addNew(request: { title: string, message: string, category:string, image: File})
  {
    const replyData = new FormData();
    replyData.append('Title', request.title);
    replyData.append('Message', request.message);
    replyData.append('Category', request.category);
    if (request.image) {
      replyData.append('Image', request.image, request.image.name);
    }

    return this.http.post<TicketResponse>(environment.endpoints.tickets.create, replyData).pipe(
      catchError((response: HttpErrorResponse) => { throw new Error(response.message) })
      , map((response: TicketResponse) =>
      {
        if (response == null) {
          throw new Error("An error occured while trying to add a new ticket");
        }
        const newTicket = new Ticket(response.id,
          response.customerId,
          response.category,
          response.title,   
          response.replies,
          response.status,
          response.openDate,
          response.closingDate,
          response.closedByUser);
        this.tickets.push(newTicket);
        this.updatedTickets.next(this.tickets.slice());
      })   
    );
   
  }
  getById(id: number)
  {
    return this.tickets.find((t) => t.id === id);
  }
  addReply(id: number, replyText: string, isInnerReply: boolean, image: File = null)
  {
    const isInnerReplyAsString = isInnerReply ? 'true' : 'false';
    const replyData = new FormData();
    if (image) {
      replyData.append('Image', image, image.name);
    }
    replyData.append('Message', replyText);
    replyData.append('IsInnerReply', isInnerReplyAsString );
    replyData.append('TicketId', id.toString());

    return this.http.post<ReplyResponse>(environment.endpoints.tickets.addReply, replyData).pipe(
      catchError((response: HttpErrorResponse) => { throw new Error(response.message) })
      , map((response: ReplyResponse) =>
      {
        if (response.error != null) {
          throw new Error(response.error);
        }
        let updatedTicket:Ticket = this.tickets.find(t => t.id == response.ticketId);
        updatedTicket.replies.push(new TicketReply(
          response.replyId,
          response.ticketId,
          response.userId,
          response.userName,
          response.message,
          response.date,
          response.isImageAttached,
          new ReplyImage(response.replyId, response.imagePath),
          response.isInnerReply
        ));
        this.selectedTicket.next(updatedTicket);
        this.updatedTickets.next(this.tickets.slice());
        return updatedTicket;
      })
    );
  }
  closeTicket(id: number)
  {
    let updatedTicket = this.getById(id);
    updatedTicket.status = environment.ticketStatus.closed;
    updatedTicket.closingDate = new Date();
    updatedTicket.closedByUser = this.authService.user.value.id;
    return this.http.put<ApiResponse>(environment.endpoints.tickets.close, {id:id});
  }

  getAllOpenTickets()
  {
    return this.tickets.filter(t => t.status === environment.ticketStatus.open);
  }

  fetchOpenTickets(role:string)
  {
    if (role === environment.roles.customer) {
      const userId = new GetByStringId(this.authService.user.value.id);
      this.http.post<Ticket[]>(environment.endpoints.tickets.getOpenTicketsByUserId, userId).subscribe((tickets) =>
      {
        this.tickets = tickets;
        this.updatedTickets.next(tickets);
      }
      );
    } else {
      this.http.get<TicketResponse[]>(environment.endpoints.tickets.getOpenTickets)
        .subscribe(
          (tickets: TicketResponse[]) =>
          {
            this.tickets = tickets;
            this.updatedTickets.next(tickets);
          }
        );
    }
  }

  filterByCategory(category: string)
  {
    if (category === "All") {
      this.updatedTickets.next(this.tickets.slice());
    } else {
      this.updatedTickets.next(this.tickets.filter(t => t.category === category).slice());
    }
   
  }

  typeAheadSearch(searchInput: string): Observable<Ticket[]>
  {
    if (searchInput != null && searchInput.length > 1) {
      const searchModel = new SearchInput(searchInput);
      return this.http.post<TicketResponse[]>(
        environment.endpoints.tickets.typeAheadSearch, searchModel).pipe(
          catchError((response: HttpErrorResponse) => { throw new Error(response.message) }),
          tap(tickets => { this.updatedTickets.next(tickets) })
        );
    } else {
      this.updatedTickets.next(this.tickets);
      return of(this.tickets);

    }

  }
}
export class SearchInput
{
  constructor(public searchInput: string) {}
}
