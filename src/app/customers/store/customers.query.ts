import { Injectable } from '@angular/core';
import { UsersQuery } from '../../utils/users-generic-store/users.query';
import { Customer } from '../models/customer.model';
import { CustomersStore } from './customers.store';



@Injectable({ providedIn: 'root' })
export class CustomersQuery extends UsersQuery<Customer, string>{
  constructor(protected store: CustomersStore)
  {
    super(store);
  }

}
