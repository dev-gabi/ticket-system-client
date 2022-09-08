import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { GenericStore } from '../../../../utils/generic-store/generic.store';
import { ErrorLog } from '../error-log.model';



@Injectable({ providedIn: 'root' })
@StoreConfig({ name: "auth-log" })
export class ErrorLogStore extends GenericStore<ErrorLog, number>{
  constructor() { super();}
}
