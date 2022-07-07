import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LogService } from '../log.service';

import { ErrorModel } from './error.model';

@Component({
  selector: 'app-error-log',
  templateUrl: './error-log.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorLogComponent implements OnInit {

  constructor(private logService: LogService) { }

  errorsPage$: Observable<any>;
  errors$: Observable<ErrorModel[]>;

  ngOnInit(): void
  {
    this.logService.fetchErrorLogs();
    this.errors$ = this.logService.errorLogs$;
    this.onChangePage(this.errors$.pipe(map(errors => errors.slice(0, 10))));
  }
  onChangePage(errorsPage: Observable<any>)
  {
    this.errorsPage$ = errorsPage;
  }

}
