import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BaseUser } from '../shared/base-user.model';
import { BaseService } from '../utils/base-service';
import { Helpers } from '../utils/helpers';
import { Customer } from './models/customer.model';
import { CustomersQuery } from './store/customers.query';
import { CustomersStore } from './store/customers.store';


@Injectable({
  providedIn: 'root'
})
export class CustomersService extends BaseService
{
  private searchUsersSubject = new Subject<BaseUser[]>();
  searchUsers$ = this.searchUsersSubject.asObservable();

  constructor(private http: HttpClient, private store: CustomersStore, private query: CustomersQuery)
  { super(); }

  getAll()
  {
    return this.http.get<Customer[]>(environment.endpoints.customers.all).pipe(
      catchError(this.handleHttpError),
      tap(customers =>
      {
        this.store.setAll(customers);
      }));
  }
  getCustomerById(id: string)
  {
    return this.http.get<Customer>(environment.endpoints.customers.single + id).pipe(
      catchError(this.handleHttpError),
      tap(customer =>
      {
        this.store.setSingle(customer);
        this.store.setActive(customer.id);
      }));
  }

  editCustomer(customer:Customer)
  {
    return this.http.put<Customer>(environment.endpoints.customers.single
      , customer).pipe(
      catchError(this.handleHttpError),
      tap(customer =>
      {
        this.store.updateActive(customer);
      })
    );
  }
  queryTypeAheadUsers(nameSearch: string)
  {
    const result = this.query.getAll({ filterBy: s => s.name.toLowerCase().indexOf(nameSearch.toLowerCase()) != -1 }) as BaseUser[];
    this.searchUsersSubject.next(Helpers.limitBaseUsersResult(result));
  }
}
