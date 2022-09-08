import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { GeneralStats } from './models/general-stats.model';
import { BaseService } from '../utils/base-service';
import { StatsStore } from './stats-store/stats.store';



@Injectable({ providedIn: 'root' })
export class AdminService extends BaseService
{
  constructor(private http: HttpClient, private statsStore:StatsStore) { super(); }

  getGeneralMonthlyStats()
  {
    return this.http.get<GeneralStats>(environment.endpoints.supporters.getGeneralMontlyStats).pipe(
      catchError(this.handleHttpError),
      //set fake id for akita state managment
      //this object will be loaded only once
      map(stats => { return { ...stats, id: 1 }; }),
      tap(stats =>
      {
        this.statsStore.setObjects([stats]);
        this.statsStore.setActive(1);
      })
    );
  }
}
