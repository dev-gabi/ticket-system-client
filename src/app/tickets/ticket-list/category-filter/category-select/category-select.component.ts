import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { DestroyPolicy } from '../../../../utils/destroy-policy';
import { CategoriesQuery } from '../../../categories/store/categories-query';
import { Category } from '../../../models/category.model';
import { TicketService3 } from '../../../ticket.service3';


@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategorySelectComponent extends DestroyPolicy
{

  constructor(private categoriesQuery: CategoriesQuery,
     private ticketService: TicketService3, private cdr: ChangeDetectorRef) { super(); }

  @Input() categories: Category[];
  selectAll = environment.ticketStatus.all;
  categories$: Observable<Category[]> = this.categoriesQuery.selectAll();


  onSelectCategory(category: string)
  {
    this.ticketService.filterByCategory(category);
    this.cdr.markForCheck();

  }

}
