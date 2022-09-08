import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthQuery } from '../store/auth.query';


@Injectable({
  providedIn: 'root'
})
export class FormDeactivateGuard implements CanDeactivate<CanFormDeactivate>
{
  constructor(private router: Router, private authQuery: AuthQuery) { }

  canDeactivate(component: CanFormDeactivate, currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot)
    : boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
  {
    if (component.isSaved || !component.form) { return true; }
      if (!component.isSaved && component.form.dirty) {

        let subject = new Subject<boolean>();
        component.openConfirmDialog();
        subject = component.confirmSubject;
        return subject.asObservable();
      }
      return true;
  }

}

export interface CanFormDeactivate
{
  openConfirmDialog: () => void;
  onConfirm: (isConfirmed: boolean) => void;
  confirmSubject: Subject<boolean>;
  isSaved: boolean;
  isConfirmDialogOpen: boolean;
  form: NgForm;
}
