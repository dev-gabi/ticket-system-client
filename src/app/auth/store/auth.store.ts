import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { GenericStore } from '../../utils/generic-store/generic.store';
import { AuthModule } from '../auth.module';
import { AuthUser } from '../models/auth-user.model';


@Injectable({ providedIn: 'root' })
@StoreConfig({ name:'auth' })
export class AuthStore extends GenericStore<AuthUser, string>{
  constructor()
  { super(); }
}
