export const registerFormatter = (VxeUI: any) => {
  VxeUI.formats.add('matchOptions', {
    tableCellFormatMethod(
      { cellValue }: { cellValue: any },
      options: any,
      key: string,
    ) {
      return options.find((item: any) => item.value === cellValue)[key] || '';
    },
  });
};
