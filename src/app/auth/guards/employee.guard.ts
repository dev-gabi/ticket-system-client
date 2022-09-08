import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Params, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { AuthUser } from '../models/auth-user.model';
import { AuthQuery } from '../store/auth.query';

@Injectable({
  providedIn:'root'
})
export class EmployeeAuthGuard implements CanActivate
{
  constructor(private authQuery: AuthQuery, private authService: AuthService,  private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
  {
    this.authService.browserPlatformAutoLogin();

    return (this.authQuery.selectActive() as Observable<AuthUser>).pipe(
      map(user =>
      {
        const isAuthenticatedEmployee = user != null && (user.role === environment.roles.supporter || user.role === environment.roles.admin);
        if (isAuthenticatedEmployee) { return true; }

        const queryParams: Params = { message: 'Restricted Aceess' };
        return this.router.createUrlTree(['/401'], { queryParams: queryParams });
      })
    );








    //return this.authService.user.pipe(
    //  take(1),
    //  map(user =>
    //  {
    //    const isAuthenticatedEmployee = user != null && (user.role === environment.roles.supporter || user.role === environment.roles.admin);
    //    if (isAuthenticatedEmployee) { return true; }

    //    const queryParams: Params = { message: 'Restricted Aceess' };
    //    return this.router.createUrlTree(['/401'], { queryParams: queryParams });
    //   })
    //);
  }

}
