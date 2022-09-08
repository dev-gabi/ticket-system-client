export interface SupporterStatsData
{
  supporterStats: SupporterStats[];
  error: string;
}
export interface SupporterStats
{
  ticketsClosed: number;
  replies: number;
  date: Date;
}
