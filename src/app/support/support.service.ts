import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { BaseUser } from '../shared/base-user.model';
import { BaseService } from '../utils/base-service';
import { Supporter } from './models/supporter.model';
import { SupportersQuery } from './store/supporters.query';
import { SupportersStore } from './store/supporters.store';
import { Helpers } from 'src/app/utils/helpers';


@Injectable({
  providedIn: 'root'
})
export class SupportService extends BaseService
{
  private searchUsersSubject = new Subject<BaseUser[]>();
  searchUsers$ = this.searchUsersSubject.asObservable();

  constructor(private http: HttpClient,
    private store: SupportersStore, private query: SupportersQuery)
  { super(); }

  getSupporterById(id: string)
  {
    return this.http.post<Supporter>(environment.endpoints.supporters.getSupporterById, { id: id }).pipe(
      catchError(this.handleHttpError),
      tap((supporter: Supporter) =>
      {
        this.store.setSingle(supporter);
        this.store.setActive(supporter.id);
      }));
  }
  querySupporterById(id: string)
  {
    this.store.setActive(id);
    return this.query.getEntity(id);
  }
  selectActiveSupporter()
  {
    return this.query.selectActive() as Observable<Supporter>;
  }
  getAll()
  {
    return this.http.get<Supporter[]>(environment.endpoints.supporters.getAll).pipe(
      catchError(this.handleHttpError),
      tap((supporters) =>
      {
           this.store.setAll(supporters);
      })
    );
  }
  editSupporter(editedSupporter: Supporter)
  {  
    return this.http.put<Supporter>(environment.endpoints.supporters.editSupporter, editedSupporter).pipe(
      catchError(this.handleHttpError),
      tap((supporter: Supporter) =>
      {
        this.store.updateActive(supporter);
      }));
  }


  queryTypeAheadSupporters(nameSearch: string)
  {
    const result = this.query.getAll({ filterBy: s => s.name.toLowerCase().indexOf(nameSearch.toLowerCase()) != -1 }) as BaseUser[];
    this.searchUsersSubject.next(Helpers.limitBaseUsersResult(result));
  }

  //deprecated type ahead via server http request
  //getTypeAheadUsers(usersInRole: string, nameSearch: string)
  //{
  //  const searchModel: Search = { role: usersInRole, searchInput: nameSearch };
  //  return this.http.post<BaseUser[]>(environment.endpoints.supporters.searchUsers, searchModel).pipe(
  //    catchError(this.handleHttpError),
  //    tap(users => { this.searchUserList.next(users) })
  //  );
  //}
}


//export interface Search
//{
//  role: string;
//  searchInput: string;
//}
