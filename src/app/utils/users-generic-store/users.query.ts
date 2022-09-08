import { Injectable } from '@angular/core';
import { EntityState, QueryEntity } from '@datorama/akita';
import { UsersStore } from './users.store';

@Injectable({
  providedIn: 'root'
})

export abstract class UsersQuery<entityType, idType> extends QueryEntity<EntityState<entityType, idType>>{
  constructor(protected store: UsersStore<entityType, idType>)
  {
    super(store);
  }
  selectedIsSingleLoaded$ = this.select(state => { return state.isSingleLoaded })
  selectedIsAllLoaded$ = this.select(state => { return state.isAllLoaded })
}
