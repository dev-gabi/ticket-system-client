import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { BaseService } from '../../utils/base-service';
import { AuthLogStore } from './auth-log/store/auth-log.store';
import { ErrorLogStore } from './error-log/store/error-log.store';


@Injectable({
  providedIn: 'root'
})
export class LogService extends BaseService
{

  constructor(private http: HttpClient) { super(); }

  fetchLogs<logType>(endpoint: string, store: AuthLogStore | ErrorLogStore)
  {
    return this.http.get<logType[]>(endpoint).pipe(
      catchError(this.handleHttpError),
      tap(logs => store.setObjects(logs))
    );
}
}
