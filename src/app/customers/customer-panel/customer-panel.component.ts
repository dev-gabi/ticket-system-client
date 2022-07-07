import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { CustomersService } from '../customers.service';

@Component({
  selector: 'app-customer-panel',
  templateUrl: './customer-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerPanelComponent implements OnInit
{
  constructor(private authService: AuthService,  private customerService: CustomersService) {}    
  displayTicketList = false;
   
  ngOnInit()
  {
    const id = this.authService.user.value.id;
    this.customerService.getCustomerById(id);
  }


}
