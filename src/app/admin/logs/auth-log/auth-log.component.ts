import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LogService } from '../log.service';

import { AuthLog } from './auth-log.model';

@Component({
  selector: 'app-auth-log',
  templateUrl: './auth-log.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLogComponent implements OnInit {

  constructor(private logService: LogService) { }
  logPage$: Observable<any>;
  logs$: Observable<AuthLog[]>;

  ngOnInit(): void
  {
    this.logService.fetchAuthLogs();
    this.logs$ = this.logService.authLogs$;

    this.onChangePage(this.logs$.pipe(map(items=> items.slice(0,10))));
  }
  onChangePage(page: Observable<any>)
  {
    this.logPage$ = page;
  }

}
