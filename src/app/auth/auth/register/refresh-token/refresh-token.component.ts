import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-refresh-token',
  templateUrl: './refresh-token.component.html'
})
export class RefreshTokenComponent  {

  isLoading = false;
  message: string = null;
  @ViewChild('f') form: NgForm;
  constructor(private authService: AuthService, private router: Router) { }

  onSubmit( email: string)
  {

    this.isLoading = true;
    this.authService.refreshRegistrationToken(email).subscribe(
      response =>
      {
        this.isLoading = false;
        if (response.isSuccess)
          this.message = response.message;
        this.form.reset();
      },
      error =>
      {
        this.isLoading = false;
        this.message = error;
      });
  }
}
