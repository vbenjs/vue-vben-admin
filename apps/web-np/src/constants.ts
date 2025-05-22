export enum ShippingCostLevel {
  QUANTITY = 'QUANTITY',
  WEIGHT = 'WEIGHT',
}

export enum CostCalcLevel {
  PRODUCT = 'PRODUCT',
  VARIANT = 'VARIANT',
}

export enum StateStatus {
  FAILED = 'failed',
  PENDING = 'pending',
  PROCESSED = 'processed',
  PROCESSING = 'processing',
}

export enum RecalculateCostsType {
  COSG_HANDLING_FEES = 'handling_fees_cogs',
  SHIPPING_COSTS = 'shipping_costs',
  TRANSACTION_FEES = 'transaction_fees',
}

export enum DefaultRoutes {
  HOME = '/dashboard',
  ONBOARS = '/onboard',
}

export enum NotificationType {
  COGS_HANDLING_FEES_EXPORT = 'cogs-handling-fees-export',
  COGS_HANDLING_FEES_IMPORT = 'cogs-handling-fees-import',
}

export const defaultRegionUUID = 'default';

export const orderStatusList = [
  {
    value: 'AUTHORIZED',
    label: 'Authorized',
  },
  {
    value: 'PAID',
    label: 'Paid',
  },
  {
    value: 'PARTIALLY_PAID',
    label: 'Partially Paid',
  },
  {
    value: 'PARTIALLY_REFUNDED',
    label: 'Partially Refunded',
  },
  {
    value: 'PENDING',
    label: 'Pending',
  },
  {
    value: 'VOIDED',
    label: 'Voided',
  },
];

export const countries = [
  { value: 'AU', label: 'Australia', icon: '🇦🇺' },
  { value: 'AT', label: 'Austria', icon: '🇦🇹' },
  { value: 'BE', label: 'Belgium', icon: '🇧🇪' },
  { value: 'CA', label: 'Canada', icon: '🇨🇦' },
  { value: 'CZ', label: 'Czechia', icon: '🇨🇿' },
  { value: 'DK', label: 'Denmark', icon: '🇩🇰' },
  { value: 'FI', label: 'Finland', icon: '🇫🇮' },
  { value: 'FR', label: 'France', icon: '🇫🇷' },
  { value: 'DE', label: 'Germany', icon: '🇩🇪' },
  { value: 'HU', label: 'Hungary', icon: '🇭🇺' },
  { value: 'HK', label: 'Hong Kong', icon: '🇭🇰' },
  { value: 'IE', label: 'Ireland', icon: '🇮🇪' },
  { value: 'IT', label: 'Italy', icon: '🇮🇹' },
  { value: 'JP', label: 'Japan', icon: '🇯🇵' },
  { value: 'LV', label: 'Latvia', icon: '🇱🇻' },
  { value: 'LT', label: 'Lithuania', icon: '🇱🇹' },
  { value: 'MX', label: 'Mexico', icon: '🇲🇽' },
  { value: 'NL', label: 'Netherlands', icon: '🇳🇱' },
  { value: 'NZ', label: 'New Zealand', icon: '🇳🇿' },
  { value: 'NO', label: 'Norway', icon: '🇳🇴' },
  { value: 'PL', label: 'Poland', icon: '🇵🇱' },
  { value: 'PT', label: 'Portugal', icon: '🇵🇹' },
  { value: 'RO', label: 'Romania', icon: '🇷🇴' },
  { value: 'SG', label: 'Singapore', icon: '🇸🇬' },
  { value: 'ES', label: 'Spain', icon: '🇪🇸' },
  { value: 'SE', label: 'Sweden', icon: '🇸🇪' },
  { value: 'CH', label: 'Switzerland', icon: '🇨🇭' },
  { value: 'GB', label: 'United Kingdom', icon: '🇬🇧' },
  { value: 'US', label: 'United States', icon: '🇺🇸' },
];

export const adType = [
  { value: 'facebook', label: 'Facebook', icon: 'logos:facebook' },
  { value: 'google', label: 'Google', icon: 'flat-color-icons:google' },
];
