import { Tag, TagType } from './stsTagModel';
import { MaterialTypeEnum } from '@/enums/materialType';
import { YN } from '@/enums/YN';

export interface MaterialFile {
  createdBy: string;
  createdTime: number;
  id: number;
  isLock?: YN;
  materialName: string;
  materialType: MaterialTypeEnum;
  refId: number;
  resource: MaterialFileResource | null;
  resourceId: string;
  tags: Tag[] | null;
}
export interface MaterialFileResource {
  createdBy: string;
  id: number;
  resourceName: string;
  resourceSize: string;
  resourceType: string;
  token: string;
  uuid: string;
}
export type MaterialType = 'STAFF_OTHER';

export interface MaterialFileForm {
  materialType: MaterialType[];
  refId: number;
  materialName?: string;
  createdTime?: string;
  tags?: string[];
  tagType?: TagType;
}
export interface MaterialFileUpdate {
  materialName: string;
  materialType: string;
  refId?: number;
  resourceId: string;
}
export interface UploadFileResponse {
  code: number;
  error: any;
  data: UploadFileResult;
  msg: string;
}
export interface UploadFileResult {
  fileName: string;
  fileSize: number;
  url: string;
  uuid: string;
}
export interface PreviewResultModel {
  name: string;
  token: string;
  uuid: string;
}
