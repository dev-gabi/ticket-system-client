import { GetByStringId } from './get-by-string-id.model';

export interface GetTicketsByStatus extends GetByStringId
{
  status: string,
  isCustomer: boolean
}
