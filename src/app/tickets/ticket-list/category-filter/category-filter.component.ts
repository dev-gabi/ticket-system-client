import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { map, skip, takeUntil, tap } from 'rxjs/operators';
import { TicketService2 } from '../../ticket.service2';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryFilterComponent implements OnInit, OnDestroy, AfterViewInit
{
  constructor(private ticketService: TicketService2, private cdr: ChangeDetectorRef) { }

  @ViewChild('input') input: ElementRef;
  @Output('category') category = new EventEmitter<string>();
  hideCategories = true;
  selectedCategory: string = null;
  clicks$ = fromEvent(document, 'click');
  categories$: Observable<string[]>;
  destroy$: Subject<boolean> = new Subject<boolean>(); 

  ngOnInit(): void
  {
    this.categories$ = this.ticketService.categories$;
  }

  ngAfterViewInit()
  {
    this.clicks$.pipe(
      skip(2),
      takeUntil(this.destroy$),
      map((event: any) =>
    {
      return (event.target.id !== 'categories' && event.target.id !== 'categorySelect') ? true : false;
    }))
      .subscribe((shouldHideResultList: boolean) =>
      {
        this.hideCategories = shouldHideResultList;
        this.cdr.markForCheck();
      });
  }
  onSelectCategory(category:string)
  {
    this.hideCategories = true;
    this.selectedCategory = category;
    this.input.nativeElement.value = category;
    this.category.emit(category);
    this.selectedCategory = null;
  }
  ngOnDestroy(): void
  {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
