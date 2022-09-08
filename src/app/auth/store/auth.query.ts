import { Injectable } from '@angular/core';
import { GenericQuery } from '../../utils/generic-store/generic.query';
import { AuthModule } from '../auth.module';
import { AuthUser } from '../models/auth-user.model';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class AuthQuery extends GenericQuery<AuthUser, string>{
  constructor(protected store: AuthStore) { super(store);}
}
