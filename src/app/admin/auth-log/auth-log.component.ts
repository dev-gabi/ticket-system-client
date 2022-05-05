import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LogService } from '../../log.service';
import { AuthLog } from './auth-log.model';

@Component({
  selector: 'app-auth-log',
  templateUrl: './auth-log.component.html'
})
export class AuthLogComponent implements OnInit {

  constructor(private logService: LogService) { }
  logPage: Array<any>;
  logSub: Subscription;
  logs: AuthLog[];

  ngOnInit(): void
  {
    this.logSub = this.logService.fetchAuthLogs().subscribe(logs =>
    {
      this.logs = logs;
 
    });
  }
  onChangePage(errorsPage: Array<any>)
  {
    this.logPage = errorsPage;
  }
  ngOnDestroy()
  {
    this.logSub.unsubscribe();
  }
}
