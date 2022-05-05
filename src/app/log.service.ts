import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { ErrorModel } from './admin/error-log/error.model';
import { AuthLog } from './admin/auth-log/auth-log.model';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) { }
  erros: ErrorModel[] = null;
  authLog: AuthLog[] = null;
  fetchErrorLogs()
  {
    if (this.erros == null) {
      return this.http.get<ErrorModel[]>(environment.endpoints.logs.getErrorLogs).pipe(
        tap((errors) => { this.erros = errors }),
        catchError((response: HttpErrorResponse) =>
        {
          return throwError(response.error);
        })
      )
    } else {
      return of(this.erros);
    }
  }
  fetchAuthLogs()
  {
    if (this.authLog == null) {
      return this.http.get<AuthLog[]>(environment.endpoints.logs.getAuthLogs).pipe(
        tap((logs) => { this.authLog = logs }),
        catchError((response: HttpErrorResponse) =>
        {
          return throwError(response.error);
        })
      )
    } else {
      return of(this.authLog);
    }
  }
}
