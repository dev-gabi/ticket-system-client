import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { DestroyPolicy } from '../../../../utils/destroy-policy';

@Component({
  selector: 'app-register-result',
  templateUrl: 'register-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterResultComponent extends DestroyPolicy implements OnInit
{
  constructor(private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) { super(); }

  isError = false;
  errorMessage: string;
  ngOnInit(): void
  {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(
      params =>
      {
        if (params["message"] != null) {
          this.isError = true;
          this.errorMessage = params["message"];
          this.cdr.markForCheck();
        }      
      }
    );
  }
  resendConfirmationEmail()
  {
    this.router.navigate(['/auth/register/resend-email']);
  }

}
