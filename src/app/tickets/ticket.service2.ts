import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, first, map, switchMap, tap } from 'rxjs/operators';
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
export class TicketService2
{
  constructor(private authService: AuthService, private http: HttpClient) { }
  //todo: error handle all functions
  private ticketsSubject = new BehaviorSubject<Ticket[]>(null);
  private selectedTicketSubject = new BehaviorSubject<Ticket>(null);
  private categoriesSubject = new BehaviorSubject<string[]>(null);
  private errorSubject = new Subject<string>(); 
  private userId: GetByStringId;

  tickets$: Observable<Ticket[]> = this.ticketsSubject.asObservable();
  categories$: Observable<string[]> = this.categoriesSubject.asObservable();
  error$: Observable<string> = this.errorSubject.asObservable();

  init()
  {
    this.userId = new GetByStringId(this.authService.user.value.id)

    this.fetchTickets(this.authService.user.value.role, environment.ticketStatus.open);

    if (!this.categoriesSubject.value ) {
      this.http.get<string[]>(environment.endpoints.tickets.getCategories).pipe(first()).subscribe(
        categories => this.categoriesSubject.next(categories)
      );
    }

  }

  getSelectedTicket(id: number)
  {
    return this.tickets$.pipe(
      filter(tickets=> tickets!=null),
      map(
        tickets =>
        {
         return tickets.find(ti => ti.id == id);
        }));
  
  }
  fetchTickets(role: string, ticketStatus:string = null)
  {
    if (ticketStatus == environment.ticketStatus.open) {
      //get tickets with status open
      if (role === environment.roles.customer) {
        return this.getOpenTicketsByUserId();
      } else {
        return this.getAllOpenTickets();
      }
    }
    else {
      //get all tickets
      if (role === environment.roles.customer) {
        return this.getAllTicketsByUser();
      }
      else {
        return this.getAllTickets();
      }
    }
  }

  private getOpenTicketsByUserId()
  {
    this.http.post<Ticket[]>(environment.endpoints.tickets.getOpenTicketsByUserId, this.userId)
      .subscribe(tickets => this.ticketsSubject.next(tickets));
  }
  private getAllOpenTickets()
  {
    this.http.get<TicketResponse[]>(environment.endpoints.tickets.getOpenTickets)
      .subscribe(tickets => this.ticketsSubject.next(tickets));
  }

  private getAllTicketsByUser() 
  {
    this.http.post<Ticket[]>(environment.endpoints.tickets.getAllByUserId, this.userId)
      .subscribe(tickets => this.ticketsSubject.next(tickets));
  }
  getAllTicketsByUserId(id) 
  {
    this.http.post<Ticket[]>(environment.endpoints.tickets.getAllByUserId, { id: id })
      .subscribe(tickets => this.ticketsSubject.next(tickets));
  }
  private getAllTickets()
  {
    this.http.get<TicketResponse[]>(environment.endpoints.tickets.getAll)
      .subscribe(tickets => this.ticketsSubject.next(tickets));
  }

  filterByCategory(category: string)
  {
    if (category === "All") {
      return this.tickets$;
    } else {
      return this.tickets$.pipe(
        map(tickets => tickets.filter(t => t.category === category)));
    }
  }

  closeTicket(id: number)
  {
    return this.http.put<ApiResponse>(environment.endpoints.tickets.close, { id: id }).pipe(
      catchError(this.handleError),
      switchMap(response =>
      {
          return this.updateTicketLocally(id);
      }))
  }

  private updateTicketLocally(id:number):Observable<Ticket>
  {
      return this.tickets$.pipe(
        map(tickets => tickets.find(t => t.id == id)),
        map(ticket =>
        {
          ticket.status = environment.ticketStatus.closed;
          ticket.closingDate = new Date();
          ticket.closedByUser = this.authService.user.value.id;
          this.selectedTicketSubject.next(ticket);

          return ticket;
        }))
  }
  addReply(id: number, replyText: string, isInnerReply: boolean, image: File = null): Observable<Ticket>
  {

    const formData = this.createReplyFormData(id, replyText, isInnerReply, image);

    return this.http.post<ReplyResponse>(environment.endpoints.tickets.addReply, formData).pipe(
      catchError(this.handleError),
      switchMap((response: ReplyResponse) =>
        {
        return this.updateReplyLocally(response);

      })
    );
  }

  private updateReplyLocally(response: ReplyResponse)
  {
    if (response.error) {
      this.errorSubject.next(response.error);
      return throwError(response.error);
    }
    else {
      return this.tickets$.pipe(
        map((tickets) => { return tickets.find(t => t.id == response.ticketId); }),
        map(
          (ticket: Ticket) =>
          {
            ticket.replies.push(new TicketReply(
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
            this.selectedTicketSubject.next(ticket);
            return ticket;
          })
      )
    }

  }

  private createReplyFormData(id: number, replyText: string, isInnerReply: boolean, image: File = null)
  {
    const isInnerReplyAsString = isInnerReply ? 'true' : 'false';
    const replyData = new FormData();

    replyData.append('Message', replyText);
    replyData.append('IsInnerReply', isInnerReplyAsString);
    replyData.append('TicketId', id.toString());
    if (image) {
      replyData.append('Image', image, image.name);
    } 
    return replyData;
  }

  private createNewTicketFormData(title: string, message: string, category: string, image: File)
  {
    const ticketData = new FormData();
    ticketData.append('Title', title);
    ticketData.append('Message', message);
    ticketData.append('Category', category);
    if (image) {
      ticketData.append('Image', image, image.name);
    }
    return ticketData;
  }

  addNew(request: { title: string, message: string, category: string, image: File })
  {
    const formData = this.createNewTicketFormData(request.title, request.message, request.category, request.image);

    const response$ = this.http.post<TicketResponse>(environment.endpoints.tickets.create, formData);

    return forkJoin(response$, this.tickets$.pipe(first())).pipe(

      catchError((response: HttpErrorResponse) => { throw new Error(response.message) }),
      map(([response, tickets]) =>
      {
        if (response == null) {
          throw new Error("An error occured while trying to add a new ticket");
        }
        tickets.push(this.createTicketFromResponse(response));
        this.ticketsSubject.next(tickets);
      }));

  }
  private createTicketFromResponse(response: TicketResponse)
  {
    return new Ticket(response.id,
      response.customerId,
      response.category,
      response.title,
      response.replies,
      response.status,
      response.openDate,
      response.closingDate,
      response.closedByUser);
  }

   handleError(response: HttpErrorResponse)
   {
     console.log(this.errorSubject)
    let error = "An unkown error has occured";
    if (response.status == 500) {
      error = response.statusText;
    }   
    this.errorSubject.next(error);

    return throwError(error);
  }
  typeAheadSearch(searchInput: string, isCustomer: boolean): Observable<Ticket[]>
  {
    if (searchInput != null  && searchInput.length > 1) {
    return this.http.post<TicketResponse[]>(
        environment.endpoints.tickets.typeAheadSearch, { searchInput: searchInput }).pipe(
          catchError((response: HttpErrorResponse) => { throw new Error(response.message) }),
          tap(tickets => this.ticketsSubject.next(tickets))
        );
    } else {
      isCustomer ? this.getAllTicketsByUser() : this.getAllTickets();
      return this.tickets$;
    }

  }
}
