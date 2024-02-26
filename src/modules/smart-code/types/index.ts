export interface CodeCreatedModel {
  mainId: number;
  className: string;
  description?: string;
  packages: string;
  templateIdList: number[];
  controllerBasePath?: string;
}
