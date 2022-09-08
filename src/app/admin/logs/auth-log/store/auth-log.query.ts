import { Injectable } from '@angular/core';
import { GenericQuery } from '../../../../utils/generic-store/generic.query';
import { AuthLog } from '../auth-log.model';
import { AuthLogStore } from './auth-log.store';




@Injectable({ providedIn: 'root' })
export class AuthLogQuery extends GenericQuery<AuthLog, number>{
  constructor(protected store: AuthLogStore) { super(store);}
}
