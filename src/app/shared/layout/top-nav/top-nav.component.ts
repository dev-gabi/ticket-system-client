import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/auth.service';
import { AuthUser } from '../../../auth/models/auth-user.model';
import { DestroyPolicy } from '../../../utils/destroy-policy';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopNavComponent extends DestroyPolicy implements OnInit
{
  admin = environment.roles.admin;
  supporter = environment.roles.supporter;
  customer = environment.roles.customer;

  constructor(private authService: AuthService, private router: Router) { super(); }
  isAuthenticated = false;
  role: string;
  userName: string;
  ngOnInit(): void
  {
    this.authService.getLoggedInUser$().pipe(takeUntil(this.destroy$)).subscribe(
     (user: AuthUser) =>
      {
        this.isAuthenticated = !!user;

        if (user) {
          this.userName = user.userName;
          this.role = user.role;
        } 
        }
    );
  }

  onLogout()
  {
    this.isAuthenticated = false;
    this.router.navigate(['/logout']);
  }

}
