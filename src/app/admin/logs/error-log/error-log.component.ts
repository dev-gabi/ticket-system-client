import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { DestroyPolicy } from '../../../utils/destroy-policy';
import { LogService } from '../log.service';
import { ErrorLog } from './error-log.model';
import { ErrorLogQuery } from './store/error-log.query';
import { ErrorLogStore } from './store/error-log.store';


@Component({
  selector: 'app-error-log',
  templateUrl: './error-log.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorLogComponent extends DestroyPolicy  implements OnInit {

  constructor(private logService: LogService, private query: ErrorLogQuery, private store: ErrorLogStore) { super(); }

  errorsPage$: Observable<any>;
  errorLogs$: Observable<ErrorLog[]> = this.query.selectAll();
  requestError$: Observable<string>;
  isLoading = true;

  ngOnInit(): void
  {
    this.query.selectedIsLoaded$.pipe(
      tap(isLoaded => this.isLoading = !isLoaded),
      filter(isLoaded => { return !isLoaded }),
      switchMap(isLoaded =>
      {
        return this.logService.fetchLogs<ErrorLog>(environment.endpoints.logs.getErrorLogs, this.store);
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    this.requestError$ = this.logService.error$;
    this.onChangePage(this.errorLogs$.pipe(map(errors => errors.slice(0, 10))));
  }
  onChangePage(errorsPage: Observable<any>)
  {
    this.errorsPage$ = errorsPage;
  }
  onCloseAlert()
  {
    this.logService.clearError();
  }
}
