import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-supporter-search',
  templateUrl: './supporter-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupporterSearchComponent implements OnInit {

  constructor() { }
  supporterRole = environment.roles.supporter; 
  ngOnInit(): void
  {

  }

}
