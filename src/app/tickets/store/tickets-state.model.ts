import { EntityState } from '@datorama/akita';
import { Ticket } from '../models/ticket.model';




export interface TicketsState extends EntityState<Ticket, number>
{
  isOpenTicketsLoaded: boolean;
  isClosedTicketsLoaded: boolean;
}
