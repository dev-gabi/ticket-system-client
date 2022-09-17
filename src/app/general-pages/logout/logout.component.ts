import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-logout',
  template: '<h4 class="mx-auto w-50 m-5">Logging Out</h4><br/><app-loading-spinner></app-loading-spinner>'
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void
  {
    this.authService.logOut();
  }

}
