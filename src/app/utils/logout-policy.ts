import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { DestroyPolicy } from './destroy-policy';

@Injectable({ providedIn: 'root' })
export abstract class LogoutPolicy extends DestroyPolicy
{
  constructor(protected authService: AuthService) { super(); }
  isLoggingOut = false;

  subscribeIsLoggingOut()
  {
    this.authService.loggingOut.pipe(takeUntil(this.destroy$))
      .subscribe(
        () => this.isLoggingOut = true
      );
  }
}
