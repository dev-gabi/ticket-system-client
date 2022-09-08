import { Injectable } from '@angular/core';
import { GenericQuery } from '../../../../utils/generic-store/generic.query';
import { ErrorLog } from '../error-log.model';
import { ErrorLogStore } from './error-log.store';


@Injectable({ providedIn: 'root' })
export class ErrorLogQuery extends GenericQuery<ErrorLog, number>{
  constructor(protected store: ErrorLogStore) { super(store);}
}
