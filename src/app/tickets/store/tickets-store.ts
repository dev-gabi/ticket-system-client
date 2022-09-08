import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { Ticket } from '../models/ticket.model';
import { TicketsState } from './tickets-state.model';
@Injectable({
  providedIn: 'root'
})

@StoreConfig({ name: 'tickets' })
export class TicketsStore extends EntityStore<TicketsState>{

  constructor()
  {
    super(createInitialState());
  }

  setTickets(tickets: Ticket[])
  {
    this.set(tickets);

    this.update({isOpenTicketsLoaded: true});
  }
  addClosedTickets(tickets: Ticket[])
  { 
    this.add(tickets);
    this.update({isClosedTicketsLoaded: true});
  }

  clearTickets()
  {    
    this.set([]);
    this.update({ isOpenTicketsLoaded: false, isClosedTicketsLoaded:false });
  }
}


export function createInitialState(): TicketsState
{
  return {
    isOpenTicketsLoaded: false,
    isClosedTicketsLoaded: false 
  };
}
