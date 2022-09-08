import { Injectable } from '@angular/core';
import { UsersQuery } from '../../utils/users-generic-store/users.query';
import { Supporter } from '../models/supporter.model';
import { SupportersStore } from './supporters.store';



@Injectable({ providedIn: 'root' })
export class SupportersQuery extends UsersQuery<Supporter, string>{
  constructor(protected store: SupportersStore)
  {
    super(store)
  }


}
