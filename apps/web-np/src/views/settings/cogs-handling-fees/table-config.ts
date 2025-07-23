import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive } from 'vue';

import { getHandlingFeesAndCOGS } from '#/api';
import { CostCalcLevel as CostCalcBy, ECogsSource } from '#/shared/constants';
import { toPercentage } from '#/shared/utils';

export const gridState = reactive({
  checkedItems: [] as any[],
});

export const gridOptions: VxeTableGridOptions = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  rowConfig: {
    height: 48,
  },
  columns: [
    {
      type: 'checkbox',
      field: 'id',
      title: '',
      width: 30,
    },
    {
      field: 'name',
      title: 'Name',
      align: 'left',
      minWidth: 200,
      treeNode: true,
      slots: { default: 'name' },
      resizable: true,
    },
    {
      title: 'Status',
      width: 100,
      slots: { default: 'status' },
    },
    {
      field: 'calcBy',
      title: 'Fee Level',
      titlePrefix: {
        content:
          'If the cost is calculated by product, the cost from the product will apply to all variants. If the cost is calculated by variant, each variant will have its own cost.',
      },
      slots: { default: 'level' },
      width: 120,
    },
    {
      field: 'cogsSource',
      title: 'COGS Source',
      titlePrefix: {
        content:
          'COGS Source indicates where the COGS data is coming from. It can be either manually entered or synced from Shopify...',
      },
      minWidth: 120,
      slots: { default: 'cogsSource' },
    },
    {
      field: 'price',
      title: 'Selling Price',
      align: 'right',
      minWidth: 120,
      slots: { default: 'price' },
    },
    {
      field: 'cogs',
      title: 'COGS',
      titlePrefix: {
        content:
          'Cost of Goods Sold (COGS) is the direct costs attributable to the production of the goods sold in a company. This amount includes the cost of the materials used in creating the good along with the direct labor costs used to produce the good.',
      },
      align: 'right',
      minWidth: 200,
      slots: { default: 'cogs' },
    },
    {
      field: 'handlingFees',
      title: 'Handling Fees',
      titlePrefix: {
        content:
          'Handling fees are the costs associated with the handling of goods, including the cost of labor, packaging, and shipping.',
      },
      align: 'right',
      minWidth: 150,
      slots: { default: 'handlingFees' },
    },
    {
      field: 'margin',
      title: 'Margin',
      titlePrefix: {
        content:
          'Margin = (Selling Price - COGS - Handling Fees) / Selling Price',
      },
      align: 'right',
      width: 90,
      slots: { default: 'margin' },
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        gridState.checkedItems = [];

        return await generateTableData(page, formValues);
      },
    },
  },
  toolbarConfig: {
    search: true,
    custom: true,
    refresh: { code: 'query' },
    zoom: true,
  },
  treeConfig: {
    parentField: 'parentId',
    rowField: 'id',
    transform: true,
    expandAll: false,
  },
};

interface IFees {
  id: string;
  type: CostCalcBy;
  cogsSource: string;
  cogs: { date: number; price: number }[];
  handlingFees: number;
}

export interface IProduct {
  id: string;
  regionId: string;
  variantId?: string;
  variantTitle?: string;
  parentId?: string;
  productId?: string;
  productTitle: string;
  isProductRow: boolean;
  loading?: boolean;
  name: string;
  status: string;
  url: string;
  image: string;
  price: number;
  priceMin: number;
  priceMax: number;
  handlingFees: number;
  handlingFeesMin: number;
  handlingFeesMax: number;
  margin: string;
  calcBy: CostCalcBy;
  calcByProduct: boolean;
  cogs: number;
  cogsMin: number;
  cogsMax: number;
  cogsShopify: number;
  cogsSource: string;
  cogsSourceShow: boolean;
  fees: Record<string, IFees>;
  variants: any[];
}

export const calcMargin = (item: IProduct) => {
  if (item.price <= 0) {
    return '-';
  }

  return `${toPercentage((item.price - item.cogs - item.handlingFees) / item.price)}%`;
};

export const isProductRow = (item: IProduct): boolean => {
  return !item.parentId;
};

export const isProductHasOneVariant = (item: IProduct): boolean => {
  return isProductRow(item) && item.variants?.length <= 1;
};

export const isShopifyCogsSource = (item: IProduct): boolean => {
  return item.cogsSource === ECogsSource.SHOPIFY;
};

async function generateTableData(page: any, formValues: any): Promise<any> {
  return await getHandlingFeesAndCOGS({
    page: page.currentPage,
    pageSize: page.pageSize,
    ...formValues,
  }).then((res) => {
    // Generate children
    generateVariantChildren(res);

    // Build the table data
    res.items = res.items.map((item: IProduct) => {
      item.isProductRow = isProductRow(item);

      if (isProductHasOneVariant(item)) {
        item.calcBy = CostCalcBy.PRODUCT;
      }
      item.calcByProduct = item.calcBy === CostCalcBy.PRODUCT;

      // Calculate handlingFee
      const regionFees = item.fees[formValues.zoneUUID] as IFees;
      item.handlingFees = regionFees.handlingFees;
      item.cogsSource = regionFees.cogsSource;
      item.cogsSourceShow = true;

      if (item.isProductRow && !item.calcByProduct) {
        item.cogsSourceShow = false;
      }

      // Sort costs by date
      regionFees.cogs = regionFees.cogs.sort((a, b) => b.date - a.date);
      item.cogs = isShopifyCogsSource(item)
        ? item.cogsShopify
        : (regionFees.cogs[0]?.price ?? 0);

      item.margin = calcMargin(item);

      return item;
    });

    // Set Min and Max values
    res.items = res.items.map((_product: IProduct) => {
      if (!_product.isProductRow) {
        return _product;
      }

      const _variants = res.items.filter(
        (c: IProduct) => c.parentId === _product.id,
      );

      _variants.forEach((_variant: IProduct) => {
        _product.priceMin = Math.min(
          _variant.price,
          _product.priceMin ?? _variant.price,
        );
        _product.priceMax = Math.max(
          _variant.price,
          _product.priceMax ?? _variant.price,
        );
        _product.cogsMin = Math.min(
          _variant.cogs,
          _product.cogsMin ?? _variant.cogs,
        );
        _product.cogsMax = Math.max(
          _variant.cogs,
          _product.cogsMax ?? _variant.cogs,
        );
        _product.handlingFeesMin = Math.min(
          _variant.handlingFees,
          _product.handlingFeesMin ?? _variant.handlingFees,
        );
        _product.handlingFeesMax = Math.max(
          _variant.handlingFees,
          _product.handlingFeesMax ?? _variant.handlingFees,
        );
      });

      return _product;
    });

    return res;
  });

  function generateVariantChildren(res: any) {
    const children: any = [];

    res.items.forEach((_product: IProduct) => {
      // Get fees for the selected region
      const regionFees = _product.fees[formValues.zoneUUID] as IFees;

      if (regionFees === undefined) {
        return true;
      }

      // Reset fields
      _product.regionId = formValues.zoneUUID;
      _product.calcBy = regionFees.type;
      _product.variants = Object.values(_product.variants);
      _product.productId = _product.id;
      _product.productTitle = _product.name;

      /**
       * Only show variants if
       * - There are more than 1 variant
       * - The products cost is calculated by variant
       */
      if (
        _product.variants.length <= 1 ||
        _product.calcBy === CostCalcBy.PRODUCT
      ) {
        return true;
      }

      _product.variants.forEach((_variant: IProduct) => {
        _variant.parentId = _product.id;
        _variant.variantId = _variant.id;
        _variant.variantTitle = _variant.name;
        _variant.productId = _product.id;
        _variant.productTitle = _product.name;
        _variant.calcBy = _product.calcBy;
        _variant.regionId = _product.regionId;
        _variant.image = _product.image;

        children.push(_variant);
      });
    });

    res.items = [...res.items, ...children];
  }
}
