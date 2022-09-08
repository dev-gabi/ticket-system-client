import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { UsersStore } from '../../utils/users-generic-store/users.store';
import { Supporter } from '../models/supporter.model';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name:'supporters' })
export class SupportersStore extends UsersStore<Supporter, string>
{
  constructor() { super();}


}
