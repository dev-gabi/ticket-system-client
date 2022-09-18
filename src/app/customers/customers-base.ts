import { Injectable } from '@angular/core';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AuthUser } from '../auth/models/auth-user.model';
import { DestroyPolicy } from '../utils/destroy-policy';
import { CustomersService } from './customers.service';
import { CustomersQuery } from './store/customers.query';

@Injectable()
export abstract class CustomersBase extends DestroyPolicy
{
  constructor(
    protected customerService: CustomersService,
    protected query: CustomersQuery,
    protected authService: AuthService
  ) { super(); }

  

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
