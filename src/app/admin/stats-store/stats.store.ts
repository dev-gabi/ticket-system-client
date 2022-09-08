import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { GenericStore } from '../../utils/generic-store/generic.store';
import { GeneralStats } from '../models/general-stats.model';



@Injectable({ providedIn:'root' })
@StoreConfig({ name: "stats" }) 
export class StatsStore extends GenericStore<GeneralStats, number>
{
  constructor() { super();}
}
