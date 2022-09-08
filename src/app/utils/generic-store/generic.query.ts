import { Injectable } from '@angular/core';
import { EntityState, QueryEntity } from '@datorama/akita';
import { GenericStore } from './generic.store';



@Injectable({
  providedIn: 'root'
})

export abstract class GenericQuery<entityType, idType> extends QueryEntity<EntityState<entityType, idType>>{
  constructor(protected store: GenericStore<entityType, idType>)
  {
    super(store);
  }
  selectedIsLoaded$ = this.select(state => { return state.isLoaded })

}
