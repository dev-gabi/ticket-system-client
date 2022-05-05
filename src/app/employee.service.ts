import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { GeneralStats } from './charts/general-stats.model';
import { BaseUser } from './shared/base-user.model';
import { Supporter } from './support/models/supporter.model';
import { TopPerformance } from './support/models/top-employee-performance-response.model';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService
{
  supporter = new BehaviorSubject<Supporter>(null);
  error = new Subject<string>();
  searchUserList = new Subject<BaseUser[]>();

  constructor( private http: HttpClient) { }

  getEmployeeById(id: string)
  {
    const stringIdModel: IdAsString = { id: id };
    return this.http.post<Supporter>(environment.endpoints.employees.getEmployeeById, stringIdModel).pipe(
      catchError(this.handleError),
      tap((user: Supporter) =>
      {
        if (user.error != null) {
          this.error.next(user.error);
        } else {
          this.supporter.next(user);
        }
      }));
  }
  getAllSupporters()
  {
    return this.http.get<BaseUser[]>(environment.endpoints.employees.getAllSupporters).pipe(
      catchError(this.handleError),
      tap((supporters) =>
      {
        this.searchUserList.next(supporters);
      })
    );
  }
  editSupporter(editedSupporter: Supporter)
  {
    
    return this.http.put<Supporter>(environment.endpoints.employees.editSupporter, editedSupporter).pipe(
      catchError(this.handleError),
      tap((user: Supporter) =>
      {
        if (user.error != null) {
          this.error.next(user.error);
        } else {
          this.supporter.next(user);
        }
      }));
  }

  getTypeAheadUsers(usersInRole: string, nameSearch: string)
  {
    if (!nameSearch) { return of();}
    const searchModel = new Search(usersInRole, nameSearch);

    return this.http.post<BaseUser[]>(environment.endpoints.employees.searchUsers, searchModel).pipe(
      catchError((response: HttpErrorResponse) =>
      {
        return throwError(response.error);
      }),
      tap(users => { this.searchUserList.next(users); })
    );
  }
  handleError(response: HttpErrorResponse)
  {
    if (response.status === 0) {
      return throwError("A Network Error Has Occured")
    }
    else {
      return throwError("Unkbown error")
    }
  }
  getTopPerformance()
  {
    return this.http.get<TopPerformance>(environment.endpoints.employees.getTopClosingTicketsStats).pipe(
      catchError((response: HttpErrorResponse) =>
      {
        return throwError(response.error);
      })
    );
  }
  getGeneralMonthlyStats()
  {
    return this.http.get<GeneralStats>(environment.endpoints.employees.getGeneralMontlyStats).pipe(
      catchError((response: HttpErrorResponse) =>
      {
        return throwError(response.error);
      })
    );
  }
}

export interface IdAsString
{
  id: string;
}
export class Search
{
  constructor(public role: string, public searchInput:string) { }
}
