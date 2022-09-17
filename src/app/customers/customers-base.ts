import { Injectable } from '@angular/core';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AuthUser } from '../auth/models/auth-user.model';
import { LogoutPolicy } from '../utils/logout-policy';
import { CustomersService } from './customers.service';
import { CustomersQuery } from './store/customers.query';

@Injectable()
export abstract class CustomersBase extends LogoutPolicy
{
  constructor(
    protected customerService: CustomersService,
    protected query: CustomersQuery,
    protected authService: AuthService
  ) { super(authService); }

  

  checkIfCustomerLoaded()
  {
    const id = (this.authService.getLoggedInUser() as AuthUser).id;

    this.query.selectedIsSingleLoaded$.pipe(
      
      filter(isLoaded => { return !isLoaded }),
      switchMap(isLoaded =>
      {
        return this.customerService.getCustomerById(id);
      }),
      takeUntil(this.destroy$),
    ).subscribe();
  }
}
