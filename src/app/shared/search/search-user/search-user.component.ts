import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EmployeeService } from '../../../employee.service';
import { TicketService2 } from '../../../tickets/ticket.service2';
import { BaseUser } from '../../base-user.model';
import { environment } from 'src/environments/environment';
import { Supporter } from '../../../support/models/supporter.model';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchUserComponent implements OnInit, OnDestroy, AfterViewInit
{
  constructor(
    private ticketService: TicketService2,
    private cdr: ChangeDetectorRef,
    private employeeService: EmployeeService,
    private router: Router) { }

  @ViewChild('searchInput') searchInput: ElementRef;
  @Input('roleSearch') roleSearch: string;
  clicks$ = fromEvent(document, 'click');
  destroy$: Subject<boolean> = new Subject<boolean>();
  isLoading = false;
  hide = true;
  users: BaseUser[] = [];
  supporterName: string;
  supporter$: Observable<Supporter>;

  ngOnInit(): void
  {
    this.employeeService.searchUserList
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (usersResult: BaseUser[]) =>
        {
          if (usersResult.length > 0) {
            this.users = usersResult;
          }
          this.hide = false;         
        });

    this.employeeService.supporter$.pipe(
      filter(supporter => supporter != null),
      takeUntil(this.destroy$)).    
      subscribe(supporter => this.supporterName = supporter.name)        
  }

  ngAfterViewInit()
  {
    this.clicks$.pipe(
      takeUntil(this.destroy$),
      map((event: any) =>
      {
        return (event.target.id !== 'resultList' && event.target.id !== 'searchInput') ? true : false;
      }))
      .subscribe((shouldHideResultList: boolean) =>
      {
        this.hide = shouldHideResultList;
        this.cdr.markForCheck();
      });

    fromEvent<any>(
      this.searchInput.nativeElement,
      'keyup'
    ).pipe(
      takeUntil(this.destroy$),
      tap(() =>
      {
        this.isLoading = true;
        this.users = [];
        this.cdr.detectChanges();
      }),
      map((event) => event.target.value),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(searchInput =>
      {
        return this.employeeService.getTypeAheadUsers(this.roleSearch, searchInput);
      })).
      subscribe(() =>
      {
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  onSelectUser(id: string)
  {
    this.isLoading = true;
    this.cdr.markForCheck();
    if (this.roleSearch == environment.roles.customer) {
      this.ticketService.getAllTicketsByUserId(id);
        this.isLoading = false;
    } else if (this.roleSearch == environment.roles.supporter) {
      this.employeeService.getEmployeeById(id).pipe(
        takeUntil(this.destroy$))
        .subscribe(() =>      
        {
          this.isLoading = false;
          this.router.navigate(['admin/supporters', this.supporterName]);
        }
      );
    }
  }

  ngOnDestroy()
  {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
