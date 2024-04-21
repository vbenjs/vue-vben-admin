export function checkFileType(file: File, accepts: string[]) {
  let reg;
  if (!accepts || accepts.length === 0) {
    reg = /.(jpg|jpeg|png|gif|webp)$/i;
  } else {
    const newTypes = accepts.join('|');
    reg = new RegExp('\\.(' + newTypes + ')$', 'i');
  }
  return reg.test(file.name);
}

export function checkImgType(file: File) {
  return isImgTypeByName(file.name);
}

export function isImgTypeByName(name: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
}

export function getBase64WithFile(file: File) {
  return new Promise<{
    result: string;
    file: File;
  }>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve({ result: reader.result as string, file });
    reader.onerror = (error) => reject(error);
  });
}
