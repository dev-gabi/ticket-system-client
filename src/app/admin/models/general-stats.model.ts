import { TopPerformance } from '../../support/models/top-employee-performance-response.model';


export interface GeneralStats
{
  totalClosedTickets: number;
  closedTicketsThatWereOpenThisMonth: number;
  totalReplies: number;
  openedTickets: number;
  topPerformance: TopPerformance;
  id?: number;//for state managment purpose - this will be set in the service when setting the store
}
