export enum CustomCostType {
  DAILY = 'daily',
  GROSS_PROFIT_PERCENTAGE = 'gross_profit_percentage',
  GROSS_SALE_PERCENTAGE = 'gross_sale_percentage',
  MONTHLY = 'monthly',
  ONE_TIME = 'one_time',
  REVENUE_PERCENTAGE = 'revenue_percentage',
  WEEKLY = 'weekly',
}

export const customCostTypes = [
  {
    value: CustomCostType.MONTHLY,
    label: 'Monthly',
  },
  {
    value: CustomCostType.WEEKLY,
    label: 'Weekly',
  },
  {
    value: CustomCostType.DAILY,
    label: 'Daily',
  },
  {
    value: CustomCostType.ONE_TIME,
    label: 'One-time',
  },
  {
    value: CustomCostType.GROSS_SALE_PERCENTAGE,
    label: '% of Gross Sale',
  },
  // {
  //   value: 'revenue_percentage',
  //   label: '% of Revenue',
  // },
  // {
  //   value: 'gross_profit_percentage',
  //   label: '% of Gross Profit',
  // },
];
