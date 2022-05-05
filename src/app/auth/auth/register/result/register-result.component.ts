import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-result',
  templateUrl: 'register-result.component.html'
})
export class RegisterResultComponent implements OnInit, OnDestroy
{

  parasSub: Subscription;
  isError = false;
  errorMessage: string;
  ngOnInit(): void
  {
    this.parasSub = this.route.queryParams.subscribe(
      params =>
      {
        if (params["message"] != null) {
          this.isError = true;
          this.errorMessage = params["message"];
        }
        
      }
    );
  }
  resendConfirmationEmail()
  {
    this.router.navigate(['/auth/register/resend-email']);
  }
  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnDestroy(): void
  {
    this.parasSub.unsubscribe();
  }
}
