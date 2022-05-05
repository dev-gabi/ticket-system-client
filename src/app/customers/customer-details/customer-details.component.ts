import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../models/customer.model';


@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html'
})
export class CustomerDetailsComponent implements OnInit
{

  constructor(private route: ActivatedRoute, private router: Router ) { }
  ngOnInit(): void
  {

    }

  @Input() customer: Customer;


  onEdit()
  {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }


}
