# @vben/backend-mock

## Description

Vben Admin 数据 mock 服务，没有对接任何的数据库，所有数据都是模拟的，用于前端开发时提供数据支持。由于 sqlite 安装需要在本地进行编译，所以这里接口是直接返回的。线上环境不再提供mock集成，可自行部署服务或者对接真实数据，同步 mock.js等工具有一些限制，比如上传文件不行、无法模拟复杂的逻辑等，所以这里使用了 真是的后端服务来实现。唯一麻烦的是本地需要同时启动后端服务和前端服务，但是这样可以更好的模拟真实环境。

## Running the app

```bash
# development
$ pnpm run start

# production mode
$ pnpm run build
```
