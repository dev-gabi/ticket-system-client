import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { DetectIsMobile } from 'src/app/shared/interface/detectIsMobile.interface';
import { Helpers } from 'src/app/utils/helpers';
import { DestroyPolicy } from '../../../utils/destroy-policy';
import { CategoriesService } from '../../categories/categories.service';
import { CategoriesQuery } from '../../categories/store/categories-query';
import { Category } from '../../models/category.model';



@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryFilterComponent extends DestroyPolicy implements DetectIsMobile
{
  constructor(private categoriesQuery: CategoriesQuery,
    private categoriesService: CategoriesService) { super(); }

  isMobile: boolean;

  categories$: Observable<Category[]> = this.categoriesQuery.selectAll();

  ngOnInit()
  {
    this.detectWindowWidth();

    this.categoriesQuery.selectedIsCategoriesLoaded$.pipe(
      filter(isLoaded => !isLoaded),
      switchMap((isLoaded) =>
      {
        return this.categoriesService.fetchCategories()
      }),
      takeUntil(this.destroy$))
      .subscribe();
  }

  @HostListener('window:resize', ['$event'])
    onResize() {
      this.detectWindowWidth();
    }
    detectWindowWidth(){
      this.isMobile = Helpers.detectWindowWidth();
    }
}
