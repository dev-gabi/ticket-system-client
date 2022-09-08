import { Injectable } from '@angular/core';
import { EntityState, EntityStore } from '@datorama/akita';



@Injectable({
  providedIn: 'root'
})

export abstract class UsersStore<entityType, idType> extends EntityStore<EntityState<entityType, idType>>{

  constructor()
  {
    super(createUsersInitialState());
  }

  setSingle(user: entityType)
  {
    this.set([user]);
    this.update({ isSingleLoaded: true });
  }
  setAll(users: entityType[])
  {
    this.set(users);
    this.update({ isAllLoaded: true });
  
  }
  clear()
  {
    this.set([]);
    this.update({ isAllLoaded: false, isSingleLoaded: false });
  }
}

export function createUsersInitialState()
{
  return {
    isAllLoaded: false,
    isSingleLoaded: false
  };
}
