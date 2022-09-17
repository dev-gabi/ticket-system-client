import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { AuthUser } from '../models/auth-user.model';
import { AuthQuery } from '../store/auth.query';


@Injectable({
  providedIn:'root'
})
export class AuthGuard implements CanActivateChild
{
  constructor(private authQuery: AuthQuery, private authService: AuthService, private router: Router) { }

  
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
  {
    this.authService.browserPlatformAutoLogin();
    return (this.authQuery.selectActive() as Observable<AuthUser>).pipe(
      map(user =>
      {
        const isAuthenticated = !!user;
        if (isAuthenticated) { return true; }
        return this.router.createUrlTree(['/auth/login']);
      })
    );
    //return this.authService.user.pipe(
    //  take(1),
    //  map(user =>
    //  {
    //    const isAuthenticated = !!user;
    //    if (isAuthenticated) { return true; }

    //    return this.router.createUrlTree(['/auth']);
    //  })
    //);
  }

}

