import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Params, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { AuthUser } from '../models/auth-user.model';
import { AuthQuery } from '../store/auth.query';


@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivateChild, CanActivate
{
  constructor(private authQuery: AuthQuery, private authService: AuthService, private router: Router) { }


  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
  {
    return this.authenticate();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
  {
    return this.authenticate();
  }

  authenticate()
  {
    this.authService.browserPlatformAutoLogin();

    return (this.authQuery.selectActive() as Observable<AuthUser>).pipe(
      map(user =>
      {
        const isAuthenticatedEmployee = user != null && user.role === environment.roles.admin;
        if (isAuthenticatedEmployee) { return true; }

        const queryParams: Params = { message: 'Restricted aceess to admins' };
        return this.router.createUrlTree(['/401'], { queryParams: queryParams });
        
      })
    );
  }
}
