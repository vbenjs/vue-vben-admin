# @vben/backend-mock

## Description

Vben Admin 数据 mock 服务，没有对接任何的数据库，所有数据都是模拟的，用于前端开发时提供数据支持。无需安装数据实现基于 json 的类数据库存储。线上环境不再提供mock集成，可自行部署服务或者对接真实数据，避免在前端直接使用 mock.js 存在的一些限制，比如上传文件不行、无法模拟复杂的逻辑等，所以这里使用了真实的后端服务来实现。唯一麻烦的是本地需要同时启动后端服务和前端服务，但是这样可以更好的模拟真实环境。

文件说明如下:

```
./
  - api/ -- 手动创建的 api
  - httpData/ -- 请求记录, 一般不提交到版本库
  - apiWeb.json -- 从 UI 界面上创建的接口数据
  - util.js -- 一些公用方法
  - mm.config.js -- mockm 的配置文件
```

## Running the app

```bash
pnpm i mockm
npx mm
```

## 参考

- [mockm 代码仓库](https://github.com/wll8/mockm/)
- [mockm 文档](https://hongqiye.com/doc/mockm/)
- [mockjs 文档](https://wll8.github.io/mockjs-examples/)
