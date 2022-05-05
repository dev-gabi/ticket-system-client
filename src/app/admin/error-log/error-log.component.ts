import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LogService } from '../../log.service';
import { ErrorModel } from './error.model';

@Component({
  selector: 'app-error-log',
  templateUrl: './error-log.component.html'
})
export class ErrorLogComponent implements OnInit {

  constructor(private logService: LogService) { }
  errorsPage: Array<any>;
  errorsSub: Subscription;
  errors: ErrorModel[];
  ngOnInit(): void
  {
    this.errorsSub = this.logService.fetchErrorLogs().subscribe(errors =>
    {
      this.errors = errors;
    });
  }
  onChangePage(errorsPage: Array<any>)
  {
    this.errorsPage = errorsPage;
  }
  ngOnDestroy()
  {
    this.errorsSub.unsubscribe();
  }
}
