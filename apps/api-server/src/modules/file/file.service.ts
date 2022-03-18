import { Injectable } from '@nestjs/common'
import fs from 'fs-extra'
import path from 'path'

const uploadUrl = 'http://localhost:5555/upload'
const filePath = path.join(__dirname, '../../../public/upload/')
fs.ensureDir(filePath)

@Injectable()
export class FileService {
  async upload(file) {
    const files = Array.isArray(file) ? file : [file]

    const fileFunc = function (file) {
      fs.writeFileSync(filePath + `/${file.originalname}`, file.buffer)
    }
    let ret = ''

    const returnFunc = function () {
      let url = ''
      files.forEach((item) => {
        url += uploadUrl + `/${item.originalname},`
      })
      ret = url.replace(/,$/gi, '')
    }

    files.forEach((item) => fileFunc(item))

    returnFunc()

    return ret
  }
}
