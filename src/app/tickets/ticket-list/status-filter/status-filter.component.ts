import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-status-filter',
  templateUrl: './status-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusFilterComponent 
{
  statusOpt = [environment.ticketStatus.open, environment.ticketStatus.closed, environment.ticketStatus.all];

  @Output('status') status = new EventEmitter<string>();


  onSelectStatus(status: string)
  {
    this.status.emit(status);
  }

}
