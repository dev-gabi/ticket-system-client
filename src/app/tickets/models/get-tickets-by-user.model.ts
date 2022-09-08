import { GetByStringId } from './get-by-string-id.model';

export interface GetTicketsByUser extends GetByStringId
{
  id: string;
  status: string;
}
