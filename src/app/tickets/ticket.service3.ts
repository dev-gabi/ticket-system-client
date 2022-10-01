import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { BaseService } from '../utils/base-service';
import { GetTicketsByUser } from './models/get-tickets-by-user.model';
import { ReplyImage } from './models/reply-image.model';
import { ReplyResponse } from './models/response/reply-response.model';
import { TicketResponse } from './models/response/ticket-response.model';
import { TicketReply } from './models/ticket-reply.model';
import { Ticket } from './models/ticket.model';
import { TicketsQuery } from './store/tickets-query';
import { TicketsStore } from './store/tickets-store';


@Injectable({
  providedIn: 'root'
})
export class TicketService3 extends BaseService
{
  constructor(private authService: AuthService, private http: HttpClient,
    private ticketStore: TicketsStore, private ticketsQuery: TicketsQuery) { super(); }

  private filteredTickets = new BehaviorSubject<Ticket[]>(null);
  filteredTickets$ = this.filteredTickets.asObservable();

  private userId: string;

  init()
  {
    this.userId = this.authService.getLoggedInUser().id;
    this.filterByStatus(environment.ticketStatus.open);
  }

  /**
   * fetch tickets according to user's role.
   * if user is a customer - fetch tickets by customer's id, else fetch tickets of all users.
   * @param role
   * @param ticketStatus
   */
  fetchTickets(role: string, ticketStatus: string)
  {
    if (role === environment.roles.customer) {
      return this.getTicketsByUserId(ticketStatus);
    } else {
      return this.getTicketsByStatus(ticketStatus);
    }
  }

  clearTicketsStore()
  {
    this.ticketStore.clearTickets();
  }
  private getTicketsByUserId(status: string)
  {
    const payloadReq: GetTicketsByUser = { id: this.userId, status: status }
    return this.http.post<TicketResponse[]>(environment.endpoints.tickets.getByUserId, payloadReq).pipe(
      catchError(this.handleHttpError),
      tap(tickets =>
      {
        status == environment.ticketStatus.open ? this.ticketStore.setTickets(tickets) : this.ticketStore.addClosedTickets(tickets);
      }));

  }

  private getTicketsByStatus(status: string)
  {
    return this.http.post<TicketResponse[]>(environment.endpoints.tickets.getTickets, { status: status })
      .pipe(
        catchError(this.handleHttpError),
        tap(tickets =>
        {
          status == environment.ticketStatus.open ?
            this.ticketStore.setTickets(tickets) :
            this.ticketStore.addClosedTickets(tickets);
        }));
  }

  setActiveTicket(id: number)
  {
    this.ticketStore.setActive(id);
    return this.ticketsQuery.selectEntity(id);
  }

  filterByCategory(category: string)
  {
    if (category === environment.ticketStatus.all) {
      this.filteredTickets.next(
        this.ticketsQuery.getAll()
      )
    } else {
      this.filteredTickets.next(
        this.ticketsQuery.getAll({
          filterBy: entity => entity.category === category
        })
      );
    }
  }

  filterByStatus(status: string)
  {
    if (status == environment.ticketStatus.all) {
      this.filteredTickets.next(
        this.ticketsQuery.getAll()
      );

    } else {
      this.filteredTickets.next(
        this.ticketsQuery.getAll({
          filterBy: entity => entity.status === status
        }));
    }
  }

  typeAheadFilterByCustomer(id: string)
  {
    this.filteredTickets.next(this.ticketsQuery.getAll({ filterBy: entity => entity.customerId === id }));
  }

  typeAheadFilterByContent(searchInput: string)
  {
    if (searchInput != null && searchInput.length > 1) {
      let result$: Ticket[] = this.ticketsQuery.getAll({
        filterBy: entity =>
          entity.title.toLowerCase().indexOf(searchInput) != -1 ||

          entity.replies.some(({ message }) =>
          {
            return message.toLowerCase().indexOf(searchInput) != -1
          })
      });

      this.filteredTickets.next(result$);
    }
    else {
      this.filteredTickets.next(this.ticketsQuery.getAll());
    }
  }
  addReply(id: number, replyText: string, isInnerReply: boolean, image: File = null): Observable<Ticket>
  {
    const formData = this.createReplyFormData(id, replyText, isInnerReply, image);

    return this.http.post<ReplyResponse>(environment.endpoints.tickets.addReply, formData).pipe(
      catchError(this.handleHttpError),
      switchMap((response: ReplyResponse) =>
      {
        return this.updateReplyLocally(response);
      }));
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

  private updateReplyLocally(response: ReplyResponse)
  {
    let ticketToUpdate: Ticket = { ...this.ticketsQuery.getEntity(response.ticketId) };
    let updatedReplies: TicketReply[] = [...ticketToUpdate.replies];
    const ri: ReplyImage = { replyId: response.replyId, path: response.imagePath };
    const tReply: TicketReply = {
      id: response.replyId,
      ticketId: response.ticketId,
      userId: response.userId,
      userName: response.userName,
      message: response.message,
      date: response.date,
      isImageAttached: response.isImageAttached,
      image: ri,
      isInnerReply: response.isInnerReply
    }
    updatedReplies.push(tReply);

    ticketToUpdate.replies = updatedReplies;
    this.ticketStore.update(response.ticketId, ticketToUpdate);
    return of(ticketToUpdate);
  }

  closeTicket(id: number): Observable<Ticket> 
  {
    return this.http.put<TicketResponse>(environment.endpoints.tickets.close, { id: id }).pipe(
      catchError(this.handleHttpError),
      switchMap(ticketResponse =>
      {
        this.ticketStore.updateActive(ticketResponse);
        this.updateClosedTicketInFilteredTickets(ticketResponse.id);
        return this.ticketsQuery.selectEntity(ticketResponse.id);
      }))
  }
  private updateClosedTicketInFilteredTickets(id:number)
  {
    let filtered = this.filteredTickets.value;
    const index = filtered.findIndex(t => t.id == id);
    filtered[index] = this.ticketsQuery.getActive() as Ticket;
    this.filteredTickets.next(filtered);
  }
  addNew(request: { title: string, message: string, category: string, image: File }): Observable<Ticket>
  {
    const formData = this.createNewTicketFormData(request.title, request.message, request.category, request.image);

    return this.http.post<TicketResponse>(environment.endpoints.tickets.create, formData).pipe(
      catchError(this.handleHttpError),
      switchMap(response =>
      {
        const newTicket = this.createTicketFromResponse(response);
        this.ticketStore.add(newTicket);
        return of(newTicket);
      })
    );

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

  private createTicketFromResponse(response: TicketResponse)
  {
    const ticket: Ticket = {
      id: response.id,
      customerId: response.customerId,
      category: response.category,
      title: response.title,
      replies: response.replies,
      status: response.status,
      openDate: response.openDate,
      closingDate: response.closingDate,
      closedByUser: response.closedByUser
    };
    return ticket;
  }
}
