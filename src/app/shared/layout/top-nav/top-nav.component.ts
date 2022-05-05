import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/auth.service';
import { AuthUser } from '../../../auth/models/auth-user.model';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit, OnDestroy
{
  subscription: Subscription;
  admin = environment.roles.admin;
  supporter = environment.roles.supporter;
  customer = environment.roles.customer;

  constructor(private authService: AuthService) { }
  isAuthenticated = false;
  role: string;
  userName: string;
  ngOnInit(): void
  {

    this.subscription = this.authService.user.subscribe(
      (user: AuthUser) =>
      {
        this.isAuthenticated = !!user;

        if (user) {
          this.userName = user.userName;
          this.getRole(user.role);
        } 
        }
      );
   

  }
  getRole(role:string)
  {
    switch (role) {
      case environment.roles.customer:
        this.role = environment.roles.customer;
        break;
      case environment.roles.supporter:
        this.role = environment.roles.supporter;
        break;
      case environment.roles.admin:
        this.role = environment.roles.admin;
        break;
      default:
        console.error("Invalid role");
    }
  }
  onLogout()
  {
    this.authService.logOut();
    this.isAuthenticated = false;
  }
  ngOnDestroy(): void
  {
    this.subscription.unsubscribe();
  }

}
