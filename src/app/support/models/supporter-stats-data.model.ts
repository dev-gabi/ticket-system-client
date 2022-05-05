export class SupporterStatsData
{
  constructor(
    public supporterStats: SupporterStats[],
    public error:string
  )
  { }
}

export class SupporterStats
{
  constructor(
    public ticketsClosed: number,
    public replies: number,
    public date: Date
  )
  { }
}
