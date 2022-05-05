import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html'
})
export class ForbiddenComponent implements OnInit, OnDestroy
{
  constructor(private route: ActivatedRoute) { }

  error = true;
  message= 'Access Forbidden!';
  queryParamsSub: Subscription;
  ngOnInit()
  {
    this.queryParamsSub = this.route.queryParams.subscribe(
      (queryParams: Params) =>
      {
        this.message = this.message + ' ' + queryParams['message'];
      }
    );
  }
  onCloseAlert()
  {
    this.error = false;
  }
  ngOnDestroy()
  {
    this.queryParamsSub.unsubscribe();
  }
}
