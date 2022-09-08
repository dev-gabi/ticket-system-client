import { EntityState } from '@datorama/akita';
import { Category } from '../../models/category.model';

export interface CategoriesState extends EntityState<Category, number>
{
  isCategoriesLoaded: boolean;
}
