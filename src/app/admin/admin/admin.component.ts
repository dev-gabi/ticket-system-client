import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DestroyPolicy } from '../../utils/destroy-policy';
import { AdminService } from '../admin.service';
import { GeneralStats } from '../models/general-stats.model';
import { StatsQuery } from '../stats-store/stats.query';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent extends DestroyPolicy implements OnInit, OnDestroy
{

  constructor(
    private adminService: AdminService, private query: StatsQuery) { super(); }

  supporterRole = environment.roles.supporter;
  error$: Observable<string>;
  generalStats$: Observable<GeneralStats> = this.query.selectActive() as Observable<GeneralStats>;

  ngOnInit(): void
  {
    this.error$ = this.adminService.error$;

    this.query.selectedIsLoaded$.pipe(
      filter(isLoaded => { return !isLoaded }),
      switchMap(isLoaded =>
      {
        return this.adminService.getGeneralMonthlyStats()
      }),
      takeUntil(this.destroy$))
      .subscribe();

  }
  onCloseAlert()
  {
    this.adminService.clearError();
  }
}
