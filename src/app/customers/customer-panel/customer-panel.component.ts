import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-customer-panel',
  templateUrl: './customer-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerPanelComponent 
{
  displayTicketList = false;
}
