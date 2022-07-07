import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Customer } from './models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor( private http: HttpClient)
  {
  }
  customerSubject = new BehaviorSubject<Customer>(null);
  customer$ = this.customerSubject.asObservable();

  getCustomerById(id: string)
  {
     this.http.get<Customer>(environment.endpoints.customers.getById + id).pipe(
      catchError((response: HttpErrorResponse) =>
      {
        return throwError(response.error);
      }),
      tap(customer => { this.customerSubject.next(customer) }

      )).subscribe();
  }

  editCustomer(customer:Customer)
  {
    return this.http.put<Customer>(environment.endpoints.customers.put, customer).pipe(
      catchError((response: HttpErrorResponse) =>
      {
        return throwError(response.error);
      }),
      tap(customer => this.customerSubject.next(customer))
    );
  }
}
