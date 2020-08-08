export interface UploadResult {
  id: string;
  name: string;
  status: string;
  url: string;
}

export interface UploadParams {
  formData: FormData;
  total: number;
}
