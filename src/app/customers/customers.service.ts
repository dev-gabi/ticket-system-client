import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Customer } from './models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor( private http: HttpClient)
  {
  }
  selectedCustomer = new Subject<Customer>();
  customer: Customer;

  getCustomerById(id: string)
  {
    return this.http.get<Customer>(environment.endpoints.customers.getById + id).pipe(
      catchError((response: HttpErrorResponse) =>
      {
       return throwError(response.error);
      }),
      tap(customer => { this.customer = customer }),
      map((customer: Customer) =>
      {
        return customer;
      }
    ))
  }

  editCustomer(customer:Customer)
  {
    return this.http.put<Customer>(environment.endpoints.customers.put, customer).pipe(
      catchError((response: HttpErrorResponse) =>
      {
        return throwError(response.error);
      }))
      .subscribe(
      customer =>
      {
          this.selectedCustomer.next(customer);
          this.customer = customer;
      }   
    );
  }
}
