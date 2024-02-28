export interface EnumsVo {
  name: string;
  code: string;
  description?: string;
}

export interface BasePageForm {
  page?: number;
  limit?: number;
  field?: string;
  order?: string;
  isTable?: boolean;
}
