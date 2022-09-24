import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { Category } from '../../models/category.model';
import { CategoriesState } from './categories-state.model';

@Injectable({
  providedIn: 'root'
})
  @StoreConfig({ name: 'categories', idKey:'name' })
export class CategoriesStore extends EntityStore<CategoriesState>{

    constructor()
    {
      super(createInitialState());
  }

  setCategories(categories: Category[], isCategoriesLoaded: boolean)
  {
    this.set(categories);
    this.update(state =>
    ({
      ...state,
      isCategoriesLoaded
    }))
  }
}
export function createInitialState(): CategoriesState
{
  return {
    isCategoriesLoaded: false
  }
}
