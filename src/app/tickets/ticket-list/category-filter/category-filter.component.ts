import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
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

}
