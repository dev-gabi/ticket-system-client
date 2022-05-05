export class TopPerformance
{
  constructor(
    public employeeStats: EmployeeStats[],
    public maxValue: number
  ) { }
}

export class EmployeeStats
{
  constructor(
    public ticketsClosed: number,
      public userName: string

  ) { }
}
