import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { DestroyPolicy } from '../../../utils/destroy-policy';
import { LogService } from '../log.service';
import { AuthLog } from './auth-log.model';
import { AuthLogQuery } from './store/auth-log.query';
import { AuthLogStore } from './store/auth-log.store';


@Component({
  selector: 'app-auth-log',
  templateUrl: './auth-log.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLogComponent extends DestroyPolicy implements OnInit {

  constructor(private logService: LogService, private query: AuthLogQuery, private store: AuthLogStore) { super(); }
  logPage$: Observable<any>;
  logs$: Observable<AuthLog[]> = this.query.selectAll();
  error$: Observable<string>;
  isLoading = true;

  ngOnInit(): void
  {
    this.query.selectedIsLoaded$.pipe(
      tap(isLoaded => this.isLoading = !isLoaded),
      filter(isLoaded => { return !isLoaded }),
      switchMap(isLoaded =>
      {
        return this.logService.fetchLogs<AuthLog>(environment.endpoints.logs.getAuthLogs, this.store);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
    this.error$ = this.logService.error$;

    this.onChangePage(this.logs$.pipe(map(items => items.slice(0, 10))));

  }
  onChangePage(page: Observable<any>)
  {
    this.logPage$ = page;
  }
  onCloseAlert()
  {
    this.logService.clearError();
  }
}
