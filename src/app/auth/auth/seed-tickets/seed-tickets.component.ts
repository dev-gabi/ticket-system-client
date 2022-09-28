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
      this.message = "Tickets created";
      this.hideLoadingIndicator();
    },
      error =>
      {
        this.message = "An error has occured";
        this.hideLoadingIndicator();
      })
  }

  hideLoadingIndicator()
  {
    this.isLoading = false;
    this.cdr.markForCheck();
  }
}
