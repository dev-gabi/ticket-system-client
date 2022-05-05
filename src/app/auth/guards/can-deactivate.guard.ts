import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate
{
  canDeactivate: () => boolean | Observable<boolean> | Promise<boolean> | UrlTree;
}
@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate>
{
  constructor(private router: Router) {}
  canDeactivate(component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextRoute?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> | UrlTree
  {
    return(component.canDeactivate());

  }
}
