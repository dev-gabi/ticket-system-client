import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import paginate from 'jw-paginate';
import { Observable, of, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DestroyPolicy } from '../../utils/destroy-policy';

@Component({
  selector: 'jw-pagination',
  templateUrl: './jw-pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class JwPaginationComponent extends DestroyPolicy implements OnChanges
{
  constructor() {super()}

  @Output() changePage = new EventEmitter<Observable<any>>();
  @Input() initialPage = 1;
  @Input() pageSize = 10;
  @Input() maxPages = 10;
  @Input() items$: Observable<any>;
  sub: Subscription;
  initSub: Subscription;
  pager: any = {};

  ngOnInit()
  {
    this.items$.pipe(
      takeUntil(this.destroy$))
      .subscribe(
        items =>
        {
          if (items.length) {
            this.setPage(this.initialPage);
          }      
        }
      );

  }

  ngOnChanges(changes: SimpleChanges)
  {
    // reset page if items array has changed
    if ( changes.items$.currentValue !== changes.items$.previousValue) {
      this.setPage(this.initialPage);
    }
  }

  setPage(page: number)
  {
    this.items$.pipe(takeUntil(this.destroy$)).subscribe(items =>
    {
  
      // get new pager object for specified page
      this.pager = paginate(items.length, page, this.pageSize, this.maxPages);

      // get new page of items from items array
      var pageOfItems = items.slice(this.pager.startIndex, this.pager.endIndex + 1);

      // call change page function in parent component
      this.changePage.emit(of(pageOfItems));
    });

  }

}
