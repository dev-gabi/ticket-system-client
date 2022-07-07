import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth/auth.service';
import { GeneralStats } from './charts/general-stats.model';
import { BaseUser } from './shared/base-user.model';
import { Supporter } from './support/models/supporter.model';
import { TopPerformance } from './support/models/top-employee-performance-response.model';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService
{
  private supporter = new BehaviorSubject<Supporter>(null);
  supporter$ = this.supporter.asObservable();
  error = new Subject<string>();
  searchUserList = new Subject<BaseUser[]>();
  supporterRple = environment.roles.supporter;

  constructor(private http: HttpClient, private authService: AuthService) { }
  setEmployeeObs()
  {
    if (this.authService.user.value.role == this.supporterRple) {
      const id = this.authService.user.value.id;
      return this.getEmployeeById(id);
    }
    return of();
  }

  getEmployeeById(id: string)
  {
    return this.http.post<Supporter>(environment.endpoints.employees.getEmployeeById, { id: id }).pipe(
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
    const searchModel: Search = { role: usersInRole, searchInput: nameSearch };
    return this.http.post<BaseUser[]>(environment.endpoints.employees.searchUsers, searchModel).pipe(
      catchError((response: HttpErrorResponse) =>
      {
        return throwError(response.error);
      }),
      tap(users => { this.searchUserList.next(users) })
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


export interface Search
{
  role: string;
  searchInput: string;
}
