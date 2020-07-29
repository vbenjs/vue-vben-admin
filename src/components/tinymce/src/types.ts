import { PropOptions } from 'compatible-vue';
import { Settings } from 'tinymce';

export interface BasicProps {
  id: string;
  options: PropOptions<Settings>;
  height: string | number;
  value: string;
  width: string | number;
  menubar: string;
  showUploadImage: boolean;
}
