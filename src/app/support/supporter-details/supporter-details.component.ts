import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DestroyPolicy } from '../../utils/destroy-policy';
import { Supporter } from '../models/supporter.model';
import { SupportersQuery } from '../store/supporters.query';



@Component({
  selector: 'app-supporter-details',
  templateUrl: './supporter-details.component.html'
})
export class SupporterDetailsComponent extends DestroyPolicy
{

  constructor(private route: ActivatedRoute, private router: Router, private query: SupportersQuery)
  { super(); }

  supporter$: Observable<Supporter> = this.query.selectActive() as Observable<Supporter>;;


  onEdit()
  {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

}
