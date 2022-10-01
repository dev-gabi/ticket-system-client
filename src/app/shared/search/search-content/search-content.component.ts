import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { TicketService3 } from '../../../tickets/ticket.service3';
import { DestroyPolicy } from '../../../utils/destroy-policy';


@Component({
  selector: 'app-search-content',
  templateUrl: './search-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchContentComponent extends DestroyPolicy implements AfterViewInit
{

  constructor(private ticketService: TicketService3, private cdr: ChangeDetectorRef) { super(); }

  @ViewChild('searchInput') searchInput: ElementRef;

  clicks$ = fromEvent(document, 'click');

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
      subscribe();
  }

}
