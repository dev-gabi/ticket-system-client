import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';
import { Ticket } from '../../tickets/models/ticket.model';

@Component({
  selector: 'app-search',
  templateUrl: './search2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Search2Component implements  OnInit
{
  constructor( private authService: AuthService) { }

  @Input('roleTypeSearch') roleTypeSearch: string;
  @Input('isAdminDash') isAdminDash = false;
  @Output('filteredTickets') filteredTickets = new EventEmitter<Observable<Ticket[]>>();

  contentSearchType = "content";
  userSearchType = "user";
  isUserSearch: boolean;
  selectedSearchType = this.contentSearchType;
  isCustomer: boolean;

  ngOnInit(): void
  {
    this.getRole();
    if (this.isAdminDash) {
      this.selectedSearchType = this.userSearchType;
      this.isUserSearch = true;
    }
  }
  getRole()
  {
    const role = this.authService.getLoggedInUser().role;
    role == environment.roles.customer ? this.isCustomer = true : this.isCustomer = false;
  }

  onSearchTypeChange(event: any)
  {
    switch (event.target.value) {
      case this.contentSearchType:
        this.isUserSearch = false;
        break;
      case this.userSearchType:
        this.isUserSearch = true;
    }
  }

}
