import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TicketService } from '../../ticket.service';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html'
})
export class CategoryFilterComponent implements OnInit, OnDestroy
{
  constructor(private ticketService: TicketService) { }

  @ViewChild('input') input: ElementRef;
  hideCategories = true;
  selectedCategory: string = null;
  categories: string[] = [];
  categoriesSub: Subscription;
  clicks$ = fromEvent(document, 'click');
  clicksSub: Subscription;


  ngOnInit(): void
  {
    this.categoriesSub = this.ticketService.getCategories().subscribe(
      (categories: string[]) => { this.categories = categories; }
    );
    this.clicksSub = this.clicks$.pipe(map((event: any) =>
    {
      return (event.target.id !== 'categories' && event.target.id !== 'categorySelect') ? true : false;
    }))
      .subscribe((shouldHideResultList: boolean) =>
      {
        this.hideCategories = shouldHideResultList;
      });
  }

  onSelectCategory(category:string)
  {
    this.hideCategories = true;
    this.selectedCategory = category;
    this.input.nativeElement.value = category;
    this.ticketService.filterByCategory(this.selectedCategory);
    this.selectedCategory = null;
  }
  ngOnDestroy(): void
  {
    this.categoriesSub.unsubscribe();
    this.clicksSub.unsubscribe();
  }
}
