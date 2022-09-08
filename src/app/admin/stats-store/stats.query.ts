import { Injectable } from '@angular/core';
import { GenericQuery } from '../../utils/generic-store/generic.query';
import { GeneralStats } from '../models/general-stats.model';

import { StatsStore } from './stats.store';


@Injectable({ providedIn: 'root' })
export class StatsQuery extends GenericQuery<GeneralStats, number>{
  constructor(protected store: StatsStore)
  {
    super(store);
  }
}
