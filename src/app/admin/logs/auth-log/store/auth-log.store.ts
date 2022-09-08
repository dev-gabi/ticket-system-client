import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { GenericStore } from '../../../../utils/generic-store/generic.store';
import { AuthLog } from  '../auth-log.model';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: "auth-log" })
export class AuthLogStore extends GenericStore<AuthLog, number>{
  constructor() { super();}
}
