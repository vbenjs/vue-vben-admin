import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getHandlingFeesAndCOGS } from '#/api';
import { CostCalcLevel as CostCalcBy } from '#/constants';
import { toPercentage } from '#/utils';

export const costTableOptions: VxeTableGridOptions = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  rowConfig: {
    height: 48,
  },
  columns: [
    {
      field: 'calcBy',
      title: 'Calc By Level',
      slots: { default: 'level' },
      width: 120,
    },
    {
      field: 'name',
      title: 'Title',
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
      minWidth: 170,
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
        return await generateTableData(page, formValues);
      },
    },
  },
  toolbarConfig: {
    search: true,
    custom: true,
    refresh: true,
    zoom: true,
  },
  treeConfig: {
    parentField: 'parentId',
    rowField: 'id',
    transform: true,
  },
};

interface IFees {
  id: string;
  type: CostCalcBy;
  handlingFees: number;
  cogs: any[];
}

export interface IProduct {
  id: string;
  regionId: string;
  variantId?: string;
  variantTitle?: string;
  parentId?: string;
  productId?: string;
  productTitle: string;
  loading?: boolean;
  name: string;
  status: string;
  url: string;
  image: string;
  price: number;
  cogs: number;
  handlingFees: number;
  margin: string;
  calcBy: CostCalcBy;
  fees: IFees[];
  variants: any[];
}

export const calcMargin = (item: IProduct) => {
  const totalCost = item.cogs + item.handlingFees;
  return `${toPercentage((item.price - totalCost) / item.price)}%`;
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
      const regionFees = item.fees[formValues.zoneUUID] as IFees;

      // Calculate handlingFee
      item.handlingFees = regionFees.handlingFees;

      // Calculate cogs
      const maxKey = Math.max(...Object.keys(regionFees.cogs).map(Number));
      item.cogs = regionFees.cogs[maxKey];

      item.margin = calcMargin(item);

      return item;
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
