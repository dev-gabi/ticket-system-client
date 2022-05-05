import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-seed-tickets',
  templateUrl: './seed-tickets.component.html'
})
export class SeedTicketsComponent implements OnInit {

  constructor(private http: HttpClient) { }
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
    },
      error =>
      {
        this.isLoading = false;

        this.message = "An error has occured";
      })
  }

}
