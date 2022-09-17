import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { UsersStore } from '../../utils/users-generic-store/users.store';
import { Customer } from '../models/customer.model';



@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'customers', resettable:true })
export class CustomersStore extends UsersStore<Customer, string>{
  constructor()
  {
    super();
  }

}
