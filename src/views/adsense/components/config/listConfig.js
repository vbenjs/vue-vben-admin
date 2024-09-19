export const listConfig = [
  {
    id: 1,
    name: 'Ad sizes',
    des: 'Estimated earnings by Ad size',
    value: ['AD_UNIT_SIZE_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['AD_UNIT_SIZE_NAME'],
  },
  {
    id: 2,
    name: 'Entire account by day',
    des: 'Estimated earnings by Date',
    value: ['DATE', 'ACCOUNT_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['DATE', 'ACCOUNT_NAME'],
  },
  {
    id: 3,
    name: 'Sites',
    des: 'Performance of each site',
    value: ['OWNED_SITE_DOMAIN_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['OWNED_SITE_DOMAIN_NAME'],
  },
  {
    id: 4,
    name: 'Ad units',
    des: 'Estimated earnings by Ad unit',
    value: ['AD_UNIT_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['AD_UNIT_NAME'],
  },
  {
    id: 5,
    name: 'Content platform',
    des: 'Estimated earnings by Platform and Content Platform',
    value: ['PLATFORM_TYPE_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['PLATFORM_TYPE_NAME'],
  },
  {
    id: 6,
    name: 'Top pages',
    des: 'Earnings for your popular pages',
    value: ['PAGE_URL'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['PAGE_URL'],
  },
  {
    id: 7,
    name: 'Countries',
    des: 'How ads perform by country',
    value: ['COUNTRY_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['COUNTRY_NAME'],
  },
  {
    id: 8,
    name: 'Products',
    des: 'Estimated earnings by Product',
    value: ['PRODUCT_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['PRODUCT_NAME'],
  },
  {
    id: 9,
    name: 'Platforms',
    des: 'Estimated earnings by Platform',
    value: ['PLATFORM_TYPE_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['PLATFORM_TYPE_NAME'],
  },
  {
    id: 10,
    name: 'Entire account by week',
    des: 'Estimated earnings by Week',
    value: ['ACCOUNT_NAME', 'WEEK'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['ACCOUNT_NAME', 'WEEK'],
  },
  {
    id: 11,
    name: 'Entire account by month',
    des: 'Estimated earnings by Month',
    value: ['ACCOUNT_NAME', 'MONTH'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['ACCOUNT_NAME', 'MONTH'],
  },
  {
    id: 12,
    name: 'Custom channels',
    des: 'Estimated earnings by Custom channel',
    value: ['CUSTOM_CHANNEL_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['CUSTOM_CHANNEL_NAME'],
  },
  {
    id: 13,
    name: 'URL channels',
    des: 'Estimated earnings by URL channels',
    value: ['URL_CHANNEL_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['URL_CHANNEL_NAME'],
  },
  {
    id: 14,
    name: 'Verified sites',
    des: 'Estimated earnings by Verified site',
    value: ['OWNED_SITE_DOMAIN_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['OWNED_SITE_DOMAIN_NAME'],
  },
  {
    id: 15,
    name: 'Served creatives',
    des: 'Estimated earnings by Served creative',
    value: ['SERVED_AD_TYPE_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['SERVED_AD_TYPE_NAME'],
  },
  {
    id: 16,
    name: 'Ad formats',
    des: 'Performance of different ad types',
    value: ['AD_FORMAT_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['AD_FORMAT_NAME'],
  },
  {
    id: 17,
    name: 'Creative sizes',
    des: 'Estimated earnings by Creative size',
    value: ['CREATIVE_SIZE_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['CREATIVE_SIZE_NAME'],
  },
  {
    id: 18,
    name: 'Targeting types',
    des: 'Estimated earnings by Targeting type',
    value: ['TARGETING_TYPE_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['TARGETING_TYPE_NAME'],
  },
  {
    id: 19,
    name: 'Bid types',
    des: 'Estimated earnings by Bid type',
    value: ['BID_TYPE_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['BID_TYPE_NAME'],
  },
  {
    id: 20,
    name: 'Ad networks',
    des: 'Estimated earnings by Ad network',
    value: ['BUYER_NETWORK_NAME'],
    metrics: [
      'ESTIMATED_EARNINGS',
      'PAGE_VIEWS',
      'IMPRESSIONS',
      'IMPRESSIONS_RPM',
      'IMPRESSIONS',
      'ACTIVE_VIEW_VIEWABILITY',
      'CLICKS',
    ],
    orderBy: ['BUYER_NETWORK_NAME'],
  },
];
