import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, filter, first, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { ApiResponse } from '../auth/models/api-response.model';
import { GetByStringId } from './models/get-by-string-id.model';
import { ReplyImage } from './models/reply-image.model';
import { ReplyResponse } from './models/response/reply-response.model';
import { TicketResponse } from './models/response/ticket-response.model';
import { TicketReply } from './models/ticket-reply.model';
import { Ticket } from './models/ticket.model';

//todo: error handling
@Injectable({
  providedIn: 'root'
})
export class TicketService 
{
  constructor(private authService: AuthService, private http: HttpClient) { }
  private ticketsSubject = new BehaviorSubject<Ticket[]>(null);
  tickets$: Observable<Ticket[]>= this.ticketsSubject.asObservable();

  selectedTicket = new Subject<Ticket>();//todo: change to private ticketsSubject = new SubjectBehavior<Ticket>();
  updatedTickets = new Subject<Ticket[]>();//todo: remove
  tickets: Ticket[] = [];//todo: remove
  //define an observable of tickets$ from the subject - subscribe in all components to tickets observable

  //todo:same login as tickets to categories - subject, Observable ...
  getCategories()
  {//todo: if this.categories.length>0 return this.categories else set categories$ from server
    return this.http.get<string[]>(environment.endpoints.tickets.getCategories);
  }
  fetchAllTickets(role: string)
  {
    if (role === environment.roles.customer) {
      return this.getAllTicketsByUser();
    }
    else {
      return this.getAllTickets();
    }
  }
  getAllTicketsByUser() 
  {
    const userId = new GetByStringId(this.authService.user.value.id);
    this.http.post<Ticket[]>(environment.endpoints.tickets.getAllByUserId, userId).pipe(

    ).subscribe(tickets => this.ticketsSubject.next(tickets));

  }
  getAllTickets()
  {
     this.http.get<TicketResponse[]>(environment.endpoints.tickets.getAll)
     .subscribe(tickets => this.ticketsSubject.next(tickets));
  }

  getTicketsByUserId(id: string)
  {
      this.tickets$.pipe(
          map(tickets => tickets.filter(t => t.customerId === id)
      ));
  }

  selectTicket(id: number)
  {
    this.getById(id).subscribe(
      ticket => this.selectedTicket.next(ticket)
    );
    
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
        // this.tickets.push(newTicket);
        // this.ticketsSubject.next(this.tickets.slice());
        let tickets = this.ticketsSubject.value;
        tickets.push(newTicket);
        this.ticketsSubject.next(tickets);
      }))
   
  }
  getById(id: number)
  {
    return this.ticketsSubject.pipe(map(tickets=> tickets.find(t => t.id === id)));
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
    alert(id)
    return this.getById(id).pipe(
        switchMap(ticket =>
        {
         
      ticket.status = environment.ticketStatus.closed;
      ticket.closingDate = new Date();
      ticket.closedByUser = this.authService.user.value.id;

      return this.http.put<ApiResponse>(environment.endpoints.tickets.close, { id: id });
    }))
  }

  //getAllOpenTickets()
  //{
  //  return this.tickets$.pipe(
  //    map(tickets=> tickets.filter(t => t.status === environment.ticketStatus.open) )
  //  )
  // // return this.tickets.filter(t => t.status === environment.ticketStatus.open);
  //}
  fetchOpenTickets(role: string)
  {
    if (role === environment.roles.customer) {
      return this.getOpenTicketsByUserId();
    } else {
      return this.getAllOpenTickets();
    }
  }
  private getOpenTicketsByUserId()
  {
      const userId = new GetByStringId(this.authService.user.value.id);
     this.http.post<Ticket[]>(environment.endpoints.tickets.getOpenTicketsByUserId, userId)
      .subscribe(tickets => this.ticketsSubject.next(tickets));;          
  }
  private getAllOpenTickets()
  {
    this.http.get<TicketResponse[]>(environment.endpoints.tickets.getOpenTickets)
      .subscribe(tickets => this.ticketsSubject.next(tickets));;
  }


  //fetchOpenTickets(role:string)
  //{//refractor to 3 methods
  //  if (role === environment.roles.customer) {
  //    const userId = new GetByStringId(this.authService.user.value.id);
  //    this.http.post<Ticket[]>(environment.endpoints.tickets.getOpenTicketsByUserId, userId).subscribe((tickets) =>
  //    {
  //      this.tickets = tickets;
  //      this.updatedTickets.next(tickets);
  //    }
  //    );
  //  } else {
  //    this.http.get<TicketResponse[]>(environment.endpoints.tickets.getOpenTickets)
  //      .subscribe(
  //        (tickets: TicketResponse[]) =>
  //        {
  //          this.tickets = tickets;
  //          this.updatedTickets.next(tickets);
  //        }
  //      );
  //  }
  //}

  filterByCategory(category: string)
  {
    if (category === "All") {
      return this.tickets$;
      //this.updatedTickets.next(this.tickets.slice());
    } else {
      return this.tickets$.pipe(
        map(  tickets => tickets.filter(t => t.category === category)));
      //this.updatedTickets.next(this.tickets.filter(t => t.category === category).slice());
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
