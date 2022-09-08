import { OnInit, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable()
export abstract class GeneralBase implements OnInit
{
  constructor(protected authService: AuthService) { }

  ngOnInit()
  {
    this.authService.browserPlatformAutoLogin();
  }
}
