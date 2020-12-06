const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const koaBody = require('koa-body');
const static = require('koa-static');
const cors = require('koa2-cors');
const app = new Koa();

app.use(cors());

app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFieldsSize: 20 * 1024 * 1024,
      multipart: true,
    },
  })
);

const uploadUrl = 'http://localhost:3001/static/upload';

router.get('/', (ctx) => {
  ctx.type = 'html';
  const pathUrl = path.join(__dirname, '/static/upload.html');
  ctx.body = fs.createReadStream(pathUrl);
});

const uploadFilePublic = function (ctx, files, flag) {
  const filePath = path.join(__dirname, '/static/upload/');
  let fileReader, fileResource, writeStream;

  const fileFunc = function (file) {
    fileReader = fs.createReadStream(file.path);
    fileResource = filePath + `/${file.name}`;

    writeStream = fs.createWriteStream(fileResource);
    fileReader.pipe(writeStream);
  };
  const returnFunc = function (flag) {
    console.log(flag);
    console.log(files);
    if (flag) {
      let url = '';
      for (let i = 0; i < files.length; i++) {
        url += uploadUrl + `/${files[i].name},`;
      }
      url = url.replace(/,$/gi, '');
      ctx.body = {
        url: url,
        code: 0,
        message: '上传成功',
      };
    } else {
      ctx.body = {
        url: uploadUrl + `/${files.name}`,
        code: 0,
        message: '上传成功',
      };
    }
  };
  if (flag) {
    // 多个文件上传
    for (let i = 0; i < files.length; i++) {
      const f1 = files[i];
      fileFunc(f1);
    }
  } else {
    fileFunc(files);
  }

  if (!fs.existsSync(filePath)) {
    fs.mkdir(filePath, (err) => {
      if (err) {
        throw new Error(err);
      } else {
        returnFunc(flag);
      }
    });
  } else {
    returnFunc(flag);
  }
};

router.post('/upload', (ctx) => {
  let files = ctx.request.files.file;
  if (files.length === undefined) {
    uploadFilePublic(ctx, files, false);
  } else {
    uploadFilePublic(ctx, files, true);
  }
});

app.use(static(path.join(__dirname)));

app.use(router.routes()).use(router.allowedMethods());

app.listen(3001, () => {
  console.log('server is listen in 3001');
});
