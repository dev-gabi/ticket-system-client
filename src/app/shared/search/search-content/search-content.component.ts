import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { TicketService3 } from '../../../tickets/ticket.service3';


@Component({
  selector: 'app-search-content',
  templateUrl: './search-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchContentComponent implements AfterViewInit, OnDestroy
{

  constructor(private ticketService: TicketService3, private cdr: ChangeDetectorRef) { }

  @ViewChild('searchInput') searchInput: ElementRef;
  
  isLoading = false;
  clicks$ = fromEvent(document, 'click');
  destroy$: Subject<boolean> = new Subject<boolean>();

  ngAfterViewInit()
  {
    fromEvent<any>(
      this.searchInput.nativeElement,
      'keyup'
    ).pipe(
      map((event) => event.target.value),
       tap(searchInput =>
      {     
         this.ticketService.typeAheadFilterByContent(searchInput)
       }),
      takeUntil(this.destroy$)
    ).
      subscribe(() =>
      {   this.isLoading = false;
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
