import { Injectable, Query } from '@angular/core';
import { Order, QueryConfig, QueryEntity } from '@datorama/akita';
import { TicketsState } from './tickets-state.model';
import { TicketsStore } from './tickets-store';


@Injectable({
  providedIn: 'root'
})
@QueryConfig({
  sortBy: 'openDate',
  sortByOrder: Order.ASC
})
export class TicketsQuery extends QueryEntity<TicketsState>{
  constructor(protected store: TicketsStore)
  {
    super(store);
  }
  selectedIsOpenTicketsLoaded$ = this.select(state => { return state.isOpenTicketsLoaded })
  selectedIsClosedTicketsLoaded$ = this.select(state => { return state.isClosedTicketsLoaded })
}
