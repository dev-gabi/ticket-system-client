import { Injectable } from '@angular/core';
import { CustomersStore } from '../../customers/store/customers.store';
import { SupportersStore } from '../../support/store/supporters.store';
import { TicketsStore } from '../../tickets/store/tickets-store';
import { AuthStore } from '../store/auth.store';

@Injectable({ providedIn: 'root' })
export class StoreCollection
{
  constructor(
    public authStore: AuthStore,
    public ticketsStore: TicketsStore,
    public customersStore: CustomersStore,
    public supportersStore: SupportersStore
  ){}
}
