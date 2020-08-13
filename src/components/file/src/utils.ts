export interface GetBase64Result {
  result: string;
  file: File;
}
export function getBase64(file: File) {
  return new Promise<GetBase64Result>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve({ result: reader.result as string, file });
    reader.onerror = (error) => reject(error);
  });
}

export function checkImgType(file: File) {
  if (!/\.(jpg|jpeg|png|gif)$/i.test(file.name)) {
    return false;
  } else {
    return true;
  }
}

export function checkFileType(file: File, accepts: string[]) {
  const newTypes = accepts.join('|');
  // const reg = /\.(jpg|jpeg|png|gif|txt|doc|docx|xls|xlsx|xml)$/i;
  const reg = new RegExp('\\.(' + newTypes + ')$', 'i');

  if (!reg.test(file.name)) {
    return false;
  } else {
    return true;
  }
}

export function generateFormData(option: { data: Object; fileList: File[] }): FormData {
  const formData = new window.FormData();

  if (option.data) {
    Object.keys(option.data).forEach(function (key) {
      const value = option.data[key];
      // support key-value array data
      if (Array.isArray(value)) {
        value.forEach(function (item) {
          // { list: [ 11, 22 ] }
          // formData.append('list[]', 11);
          formData.append(key + '[]', item);
        });
        return;
      }

      formData.append(key, option.data[key]);
    });
  }
  option.fileList.forEach((file) => {
    formData.append('files[]', file);
  });
  return formData;
}
