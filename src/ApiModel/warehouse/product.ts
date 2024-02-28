import { YN } from '@/enums/YN';
import { HxCustomer } from '../configuration/customer';
import { HxBaseData } from '../configuration/base';
import { HxBaseEfficiency } from '../configuration/efficiency';
import { HxBaseProduct } from '../configuration/product';
import { ProductType } from '@/enums/productType';
import { ProductStatus } from '@/enums/productStatus';
import { SourceType } from '@/enums/sourceType';
import { BasePageForm } from '..';

export interface HxProduct {
  id: number; // id
  barCode: string; // 条码
  productType: ProductType; // 类型，盒、箱、托
  boxCode: string; // 所属箱
  palletCode: string; // 所属托
  templateId: string; // 打印模版id，多个用,分割
  serialNum: string; // 序列号
  serialLen: number; // 序列号长度
  productId: number; // 产品id
  classId: number; // 班次id
  lineId: number; // 线别id
  efficiencyId: number; // 效率id
  pieceId: number; // 片源id
  crystalId: number; // 单多晶类型id
  levelId: number; // 等级id
  colorId: number; // 颜色id
  feId: number; // fe id
  beId: number; // be id
  binSuffix: string; // bin后缀
  timeCode: string; // 出料时间
  siteCode: string; // 工位
  lotCode: string; // 生产批次
  impp: string; // impp
  qrcode: string; // 二维码
  note1: string; // 备注1
  note2: string; // 备注2
  note3: string; // 备注3
  note4: string; // 备注4
  note5: string; // 备注5
  status: ProductStatus; // 状态：未入库/库存中/已出库
  mix: YN; // 是否混装：Y->是；N->否
  fullBox: YN; // 是否装满：Y->是；N->否
  pieceCount: number; // 总片数
  boxCount: number; // 总箱数，仅箱中存在
  packageCount: number; // 总盒数，仅托中存在
  customerId: number; // 客户id
  packingDate: Date; // 包装日期
  createdTime: Date; // 创建时间
  createdBy: string; // 创建人
  createdName: string; // 创建人
  source: SourceType; // 来源，手动创建（pc）,扫码生成（pda）
  deleted: YN; // 是否删除：Y->是；N->否
  product: HxBaseProduct; // 产品相关扩展数据
  efficiency: HxBaseEfficiency;
  clazz: HxBaseData;
  line: HxBaseData;
  piece: HxBaseData;
  crystal: HxBaseData;
  level: HxBaseData;
  color: HxBaseData;
  fe: HxBaseData;
  be: HxBaseData;
  customer: HxCustomer; // 客户
  printRuleId: number;
  barcodeRuleId: number;
  timeCodeAuto: boolean;

  subList?: HxProduct[];
}

export interface QueryHxProductForm extends BasePageForm {
  barCode?: string;
  productType?: ProductType;
  boxCode?: string;
  noBoxCode?: YN;
  palletCode?: string;
  noPalletCode?: YN;
  serialNum?: string;
  productId?: number;
  classId?: number;
  lineId?: number;
  efficiencyId?: number;
  pieceId?: number;
  crystalId?: number;
  levelId?: number;
  colorId?: number;
  feId?: number;
  beId?: number;
  binSuffix?: string;
  timeCode?: string;
  siteCode?: string;
  lotCode?: string;
  impp?: string;
  qrcode?: string;
  status?: ProductStatus;
  mix?: YN;
  fullBox?: YN;
  customerId?: number;
  packingDate?: string;
  createdTime?: string;
  createdBy?: string;
  createdName?: string;
  source?: SourceType;
  deleted?: YN;
}

export interface TimeLine {
  time: string;
  source: string;
  operator: string;
  title: string;
  billCode?: string;
}

export interface MesPackageForm {
  barCode: string; // 条码
  serialNum: string; // 序列号
  productName: string; // 产品名称
  productSpec: string; // 产品规格
  productShape: string; // 产品图形
  productFigure: string; // 产品figure
  productBar: string; // 产品bar
  productPn: string; // 产品料号
  productOther: string; // 产品别名
  productMark: string; // 产品备注
  efficiencyName: string; // 效率名称
  efficiencyPower: string; // norminal功率？
  efficiencyRatio: string; // efficiency效率比
  efficiencyVoltage: string; // efficiency电压
  efficiencyBar: string; // efficiency条码值
  className: string; // 班次名称
  classOther: string; // 班次别名
  classBar: string; // 班次条码值
  lineName: string; // 线别名称
  lineOther: string; // 线别别名
  lineBar: string; // 线别条码值
  pieceName: string; // 片源名称
  pieceOther: string; // 片源别名
  pieceBar: string; // 片源条码值
  crystalName: string; // 单多晶类型名称
  crystalOther: string; // 单多晶类型别名
  crystalBar: string; // 单多晶类型条码值
  levelName: string; // 等级名称
  levelOther: string; // 等级别名
  levelBar: string; // 等级条码值
  colorName: string; // 颜色名称
  colorOther: string; // 颜色别名
  colorBar: string; // 颜色条码值
  feName: string; // fe 名称
  feOther: string; // fe 别名
  feBar: string; // fe 条码值
  beName: string; // be 名称
  beOther: string; // be 别名
  beBar: string; // be 条码值
  binSuffix: string; // bin后缀
  timeCode: string; // 出料时间
  siteCode: string; // 工位
  lotCode: string; // 生产批次
  impp: string; // impp
  qrcode: string; // 二维码
  note1: string; // 备注1
  note2: string; // 备注2
  note3: string; // 备注3
  note4: string; // 备注4
  note5: string; // 备注5
  pieceCount: number; // 总片数
  customerName: string; // 客户名称
  packingDate: Date; // 包装日期
  packages: string[]; // 盒码列表
}

export interface SyncProgressVo {
  syncing: boolean;
  totalCount: number;
  completeCount: number;
}
