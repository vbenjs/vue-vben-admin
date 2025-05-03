export interface ILineItem {
  id: string;
  title: string;
  cogs: number;
  countryCode: string;
  createdAt: string;
  handlingFees: number;
  netPayment: number;
  orderId: string;
  pricePerUnit: number;
  processedAt: string;
  productId: string;
  quantityCurrent: number;
  quantityRefund: number;
  quantityTotal: number;
  shopId: string;
  updatedAt: string;
  variantId: string;
}

export interface IOrder {
  id: string;
  name: string;
  processedAt: string; // ISO date string
  grossSales: number;
  totalDiscount: number;
  totalShipping: number;
  totalTip: number;
  totalTax: number;
  totalRefund: number;
  netPayment: number;
  cogs: number;
  handlingFees: number;
  shippingCosts: number;
  transactionFees: number;
  grossProfit: number;
  paymentGateway: string;
  quantityCurrent: number;
  quantityRefund: number;
  quantityTotal: number;
  weight: number;
  financialStatus: string;
}
