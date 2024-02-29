import { StoreResult } from './storeModel';
import { TerminalType } from '@/enums/terminalType';

export interface QueryGatewayForm {
  storeId?: number;
  storeInfo?: string;
  terminalType?: string;
  terminalNum?: string;
}

export interface GatewayResult {
  id: number;
  storeId: number;
  terminalType: TerminalType | string;
  terminalNum: string;
  otherInfo: string;
  mark: string;
  lastDataTime: string;
  createTime: string;
  createBy: string;
  updateTime: string;
  updateBy: string;

  store: StoreResult;
}
