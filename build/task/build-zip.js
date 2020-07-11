const compressing = require('compressing');
const fs = require('fs-extra');
const moment = require('moment');

const { successTip, errorTip } = require('../utils');
const resolve = require('../getCwdPath');
const { readFile } = fs;

/**
 * @description:
 * @Date: 2020-03-17 15:14:55
 */
function buildZip(dir, zipName) {
  readFile(resolve('package.json'), (err, res) => {
    if (err) {
      errorTip('压缩报错' + err);
      return;
    }
    const pkg = JSON.parse(res.toString());
    compressing.zip
      .compressDir(
        resolve(dir),
        resolve(`${zipName}_${moment().format('MMDD')}_v${pkg.version}.zip`)
      )
      .then(() => {
        successTip(
          `The file was successfully compressed and has been compressed to【${resolve(zipName)}】`
        );
      })
      .catch((err) => {
        errorTip(' Compression error\n' + err);
        console.error(err);
      });
  });
}
module.exports = { buildZip };
