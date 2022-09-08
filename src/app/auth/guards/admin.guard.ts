import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Params, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthQuery } from '../store/auth.query';
import { AuthUser } from '../models/auth-user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate
{
  constructor(private authQuery: AuthQuery, private authService: AuthService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
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


    //return this.authService.user.pipe(
    //  take(1),
    //  map(user =>
    //  {
    //    const isAuthenticatedEmployee = user != null &&  user.role === environment.roles.admin;
    //    if (isAuthenticatedEmployee) { return true; }
    //    const queryParams: Params = { message: 'Restricted aceess to admins' };
    //    return this.router.createUrlTree(['/401'], { queryParams: queryParams });
    //  })
    //);
  }

}
