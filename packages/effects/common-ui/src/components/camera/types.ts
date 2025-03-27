export interface CameraProps {
  modelValue?: null | string;
  width?: number;
  height?: number;
  facingMode?: 'environment' | 'user';
  disabled?: boolean;
}

export interface CameraEmits {
  (e: 'update:modelValue', value: null | string): void;
  (e: 'error', error: Error): void;
  (e: 'success', photo: string): void;
}

export interface CameraInstance {
  takePhoto: () => Promise<string>;
  retake: () => void;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}
