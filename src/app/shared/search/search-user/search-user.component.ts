import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../../auth/auth.service';
import { CustomersService } from '../../../customers/customers.service';
import { CustomersQuery } from '../../../customers/store/customers.query';
import { SupportersQuery } from '../../../support/store/supporters.query';
import { SupportService } from '../../../support/support.service';
import { TicketService3 } from '../../../tickets/ticket.service3';
import { DestroyPolicy } from '../../../utils/destroy-policy';
import { BaseUser } from '../../base-user.model';



@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchUserComponent extends DestroyPolicy implements OnInit, AfterViewInit
{
  constructor(
    private ticketService: TicketService3,
    private cdr: ChangeDetectorRef,
    private supportService: SupportService,
    private customersService:CustomersService,
    private router: Router,
    private supportersQuery: SupportersQuery,
    private customersQuery: CustomersQuery,
    protected authService: AuthService)
  { super(); }

  @ViewChild('searchInput') searchInput: ElementRef;
  @Input('roleSearch') roleSearch: string;
  hide = false;
  users$: Observable<BaseUser[]> ;


  ngOnInit(): void
  {

    if (this.roleSearch == environment.roles.supporter  ) {
      this.users$ = this.supportService.searchUsers$;
      this.checkIfSuportersLoaded();
    }
    else if (this.roleSearch == environment.roles.customer ) {
      this.users$ = this.customersService.searchUsers$;
      this.checkIfCustomersLoaded();
    }

  }

  checkIfSuportersLoaded()
  {
     this.supportersQuery.selectedIsAllLoaded$.pipe(
        filter(isLoaded => { return !isLoaded }),
        switchMap(() =>
        {
          return this.supportService.getAll();
        }),
        takeUntil(this.destroy$)
      ).subscribe();
  }


  checkIfCustomersLoaded()
  {
    this.customersQuery.selectedIsAllLoaded$.pipe(
      filter(isLoaded => { return !isLoaded }),
      switchMap(() =>
      {
        return this.customersService.getAll();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngAfterViewInit()
  {
    this.subscribeToggleDisplay();
    this.subscribeKeyupOnInput();
  }

  subscribeKeyupOnInput()
  {
    fromEvent<any>(
      this.searchInput.nativeElement,
      'keyup'
    ).pipe(
      map((event) => event.target.value),
      takeUntil(this.destroy$))
      .subscribe(
        searchInput =>
        {
          if (this.roleSearch == environment.roles.supporter) {
            this.supportService.queryTypeAheadSupporters(searchInput);
          } else {
            this.customersService.queryTypeAheadUsers(searchInput);
          }
          this.hide = false;
        });
  }

  subscribeToggleDisplay()
  {
    fromEvent(document, 'click').pipe(
      map((event: any) =>
      {
        return (event.target.id !== 'resultList' && event.target.id !== 'searchInput') ? true : false;
      }),
      takeUntil(this.destroy$))
      .subscribe((shouldHideResultList: boolean) =>
      {
        this.hide = shouldHideResultList;
        this.cdr.markForCheck();
      });
  }

  onSelectUser(id: string)
  {
    if (this.roleSearch == environment.roles.customer) {
      this.ticketService.typeAheadFilterByCustomer(id);   
    }
    else if (this.roleSearch == environment.roles.supporter) {
      const supporterName = this.supportService.querySupporterById(id).name;
      this.router.navigate(['admin/supporters', supporterName]);
    }
  }

}
