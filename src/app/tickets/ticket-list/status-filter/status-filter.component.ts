import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-status-filter',
  templateUrl: './status-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusFilterComponent 
{
  //TODO add isMobileDevice variable tp check device width and avoid loading app-status-select twice
}
