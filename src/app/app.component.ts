import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit
{
  constructor(private authService: AuthService, @Inject(PLATFORM_ID) private platformId) {}
  ngOnInit(): void
  {
    if (isPlatformBrowser(this.platformId)) {//run this code only if the running platform is a browser - not a server
      this.authService.autoLogin();
    }
  }
  title = 'ticket-system';

}
