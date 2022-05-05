import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Params, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn:'root'
})
export class EmployeeAuthGuard implements CanActivate
{
  constructor(private authService: AuthService,  private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
  {
    return this.authService.user.pipe(
      take(1),
      map(user =>
      {
        const isAuthenticatedEmployee = user != null && (user.role === environment.roles.supporter || user.role === environment.roles.admin);
        if (isAuthenticatedEmployee) { return true; }

        const queryParams: Params = { message: 'Restricted Aceess' };
        return this.router.createUrlTree(['/401'], { queryParams: queryParams });
       })
    );
  }

}
