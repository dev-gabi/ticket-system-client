import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { DestroyPolicy } from '../../../utils/destroy-policy';
import { CategoriesService } from '../../categories/categories.service';
import { CategoriesQuery } from '../../categories/store/categories-query';
import { Category } from '../../models/category.model';



@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryFilterComponent extends DestroyPolicy 
{
  constructor(private categoriesQuery: CategoriesQuery,
    private categoriesService: CategoriesService) { super(); }


  @Output('category') category = new EventEmitter<string>();
  selectAll = environment.ticketStatus.all;
  categories$: Observable<Category[]> = this.categoriesQuery.selectAll();

  ngOnInit()
  {

    this.categoriesQuery.selectedIsCategoriesLoaded$.pipe(
      filter(isLoaded => !isLoaded),
      switchMap((isLoaded) =>
      {
        return this.categoriesService.fetchCategories()
      }),
      takeUntil(this.destroy$))
      .subscribe();
  }

  onSelectCategory(category: string)
  {
    this.category.emit(category);
  }

}
