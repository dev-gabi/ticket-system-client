import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { DestroyPolicy } from '../../utils/destroy-policy';
import { SupportersQuery } from '../store/supporters.query';
import { SupportService } from '../support.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsComponent extends DestroyPolicy implements OnInit
{
  constructor(
    private supportersQuery: SupportersQuery,
    private supportService: SupportService,
    private authService: AuthService)
  { super(); }

  ngOnInit()
  {
    const id = this.authService.getLoggedInUser().id;
    if (id) {
      this.supportersQuery.selectedIsSingleLoaded$.pipe(
        filter(isLoaded => { return !isLoaded }),
        switchMap(isLoaded =>
        {
          return this.supportService.getSupporterById(id);
        }),
        takeUntil(this.destroy$)
      ).subscribe();
    }
  }
}
