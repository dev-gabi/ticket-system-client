import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Ticket } from './models/ticket.model';
import { TicketService } from './ticket.service';

@Injectable({
  providedIn:'root'
})
export class TicketResolver implements Resolve<Ticket[]>
{
  constructor(private ticketService: TicketService, private authservice:AuthService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Ticket[] | Observable<Ticket[]> | Promise<Ticket[]>
  {
    if (this.ticketService.tickets.length === 0) {
      this.ticketService.fetchOpenTickets(this.authservice.user.value.role);    
    } 
    return this.ticketService.tickets;
   
  }

}
