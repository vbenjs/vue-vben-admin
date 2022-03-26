export interface GrowCardItem {
  icon: string
  title: string
  value: number
  total: number
  color: string
  action: string
}

export const growCardList: GrowCardItem[] = [
  {
    title: '访问数',
    icon: 'visit-count',
    value: 2000,
    total: 120000,
    color: 'green',
    action: '月',
  },
  {
    title: '成交额',
    icon: 'total-sales',
    value: 20000,
    total: 500000,
    color: 'blue',
    action: '月',
  },
  {
    title: '下载数',
    icon: 'download-count',
    value: 8000,
    total: 120000,
    color: 'orange',
    action: '周',
  },
  {
    title: '成交数',
    icon: 'transaction',
    value: 5000,
    total: 50000,
    color: 'purple',
    action: '年',
  },
]
