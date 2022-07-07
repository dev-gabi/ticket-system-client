import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef,  Input,  OnDestroy,  ViewChild } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { TicketService2 } from '../../../tickets/ticket.service2';

@Component({
  selector: 'app-search-content',
  templateUrl: './search-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchContentComponent implements AfterViewInit, OnDestroy
{

  constructor(private ticketService: TicketService2, private cdr: ChangeDetectorRef) { }


  @ViewChild('searchInput') searchInput: ElementRef;
  @Input('isCustomer') isCustomer: boolean;
  
  isLoading = false;
  clicks$ = fromEvent(document, 'click');
  destroy$: Subject<boolean> = new Subject<boolean>();

  ngAfterViewInit()
  {
    fromEvent<any>(
      this.searchInput.nativeElement,
      'keyup'
    ).pipe(
      takeUntil(this.destroy$),
      tap(() =>
      {
        this.isLoading = true;
        this.cdr.detectChanges();
      }),
      map((event) => event.target.value),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(searchInput =>
      {     
        return this.ticketService.typeAheadSearch(searchInput, this.isCustomer)
      })).
      subscribe(() =>
        {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      );
  }

  ngOnDestroy(): void
  {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
