import FileService from '../service/FileService';

class FileController {
  private service: FileService = new FileService();

  upload = async (ctx) => {
    const files = ctx.request.files.file;
    console.log(files);

    if (files.length === undefined) {
      this.service.upload(ctx, files, false);
    } else {
      this.service.upload(ctx, files, true);
    }
  };

  exportExcel = async (ctx) => {
    const params = ctx.request.body;
    console.log(params);
    ctx.set('Content-Type', 'application/vnd.openxmlformats');
    ctx.set('Content-Disposition', 'attachment; filename=testExcel.xlsx');
    const excelContent = await this.service.exportExcel();
    ctx.body = excelContent;
  };
}

export default new FileController();
