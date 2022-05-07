import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';
import { EmployeeService } from '../../employee.service';
import { TicketService } from '../../tickets/ticket.service';
import { BaseUser } from '../base-user.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements AfterViewInit, OnInit
{
  constructor(private ticketService: TicketService, private authService: AuthService, private employeeService: EmployeeService,
    private router: Router) { }

  @ViewChild('searchInput') searchInput: ElementRef;
  @Input('roleTypeSearch') roleTypeSearch: string;
  @Input('isAdminDash') isAdminDash = false;
  users: BaseUser[] = [];
  clicks$ = fromEvent(document, 'click');
  clicksSub: Subscription;
  userResultSub: Subscription;
  searchSub: Subscription;
  selectedUserSub: Subscription;
  subscriptions : Subscription[] = [];
  ticketSearchType = "ticket";
  userSearchType = "user";
  selectedSearchType = this.ticketSearchType;
  isCustomer: boolean;
  hide = true;
  isLoading = false;

  ngOnInit(): void
  {

    this.setRole();
    if (this.isAdminDash) { this.selectedSearchType = this.userSearchType; }
    this.clicksSub = this.clicks$.pipe(map((event: any) =>
    {
      return (event.target.id !== 'resultList' && event.target.id !== 'searchInput') ? true : false;
    }))
      .subscribe((shouldHideResultList: boolean) =>
      {
        this.hide = shouldHideResultList;
      });

    this.userResultSub = this.employeeService.searchUserList.subscribe(
      (usersResult:BaseUser[]) =>
      {
        if (usersResult.length > 0) {
          this.users = usersResult;
        }
        this.hide = false;
      });
    this.subscriptions.push(this.clicksSub, this.userResultSub);
  }
  setRole()
  {
    const role = this.authService.user.value.role;
    role == environment.roles.customer ? this.isCustomer = true : this.isCustomer = false;
  }
  ngAfterViewInit()
  {
    this.searchSub = fromEvent<any>(
      this.searchInput.nativeElement,
      'keyup'
    ).pipe(
      map((event) => event.target.value),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((searchInput) =>
      {
        this.users = [];
        if (this.selectedSearchType == this.ticketSearchType) {
          return this.ticketService.typeAheadSearch(searchInput)
        }
        else if (this.selectedSearchType == this.userSearchType) {
          return this.employeeService.getTypeAheadUsers(this.roleTypeSearch, searchInput);
        }
        console.error("invalid search type");
        return null;
      }
      )).subscribe();
    this.subscriptions.push(this.searchSub);
  }
  onSearchTypeChange(event:any)
  {
    this.selectedSearchType = event.target.value;
  }
  onSelectUser(id: string)
  {
    this.isLoading = true;
    if (this.roleTypeSearch == environment.roles.customer) {     
      this.ticketService.getTicketsByUserId(id);
      this.isLoading = false;
    } else if (this.roleTypeSearch == environment.roles.supporter) {
      this.selectedUserSub = this.employeeService.getEmployeeById(id).subscribe(
        supporter =>
        {
          this.isLoading = false;
          this.router.navigate(['admin/supporters', this.employeeService.supporter.value.name]);
        }
      );
      this.subscriptions.push(this.selectedUserSub);
    }
  }

  ngOnDestroy()
  {
    this.subscriptions.forEach(s => { if (s) { s.unsubscribe() } })
  }

}
