import { Injectable } from '@angular/core';
import { EntityState, EntityStore } from '@datorama/akita';


@Injectable({
  providedIn: 'root'
})


export abstract class GenericStore<entityType, idType> extends EntityStore<EntityState<entityType, idType>>{

  constructor()
  {
    super(createInitialState());
  }

  setObjects(objects: any)
  {
    this.set(objects);
    this.update({ isLoaded: true });
  }
  clear()
  {
    this.set([]);
    this.update({ isLoaded: false });
  }
}

export function createInitialState()
{
  return {
    isLoaded: false,
  };
}
