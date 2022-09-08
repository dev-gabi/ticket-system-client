import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CategoriesState } from './categories-state.model';
import { CategoriesStore } from './categories-store';

@Injectable({
  providedIn: 'root'
})
export class CategoriesQuery extends QueryEntity<CategoriesState>{
  constructor(protected store: CategoriesStore)
  {
      super(store);
  }
  selectedIsCategoriesLoaded$ = this.select(state => { return state.isCategoriesLoaded })
} 
