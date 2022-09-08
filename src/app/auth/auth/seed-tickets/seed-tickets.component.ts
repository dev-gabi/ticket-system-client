import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-seed-tickets',
  templateUrl: './seed-tickets.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeedTicketsComponent implements OnInit {

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }
  message: string = null;
  isLoading = false;
  ngOnInit(): void {
  }

  onSeed()
  {
    this.isLoading = true;
    this.http.get(environment.endpoints.tickets.seedTickets).subscribe(res =>
    {
      this.isLoading = false;
      this.message = "Tickets created";
      this.cdr.markForCheck();
    },
      error =>
      {
        this.isLoading = false;
        this.message = "An error has occured";
        this.cdr.markForCheck();
      })
  }

}
