# koa-restful-quick-start

koa-restful 快速启动工程

<p align="center">
    <br />
    <br />
    <a href="https://codesandbox.io/p/github/WangMingHua111/koa-restful-quick-start/master">查看Demo/在线测试</a>
  </p>

![serve模式运行截图](image/codesandbox.png)

## 快速开始

```sh
# 克隆项目
git clone https://github.com/WangMingHua111/koa-restful-quick-start.git
# 进行工作目录
cd koa-restful-quick-start
# 安装依赖
npm install
# dev模式启动
npm run dev
```

## 本地开发

```sh
npm run dev
```

## 构建生产环境

```sh
npm run build
```

## 运行服务

```sh
npm run serve
```

## Http Serve

```sh
http://localhost:3000
```

## 运行截图

### dev 模式

![dev模式运行截图](image/dev.png)

### 线上模式

![serve模式运行截图](image/serve.png)

### 自动生成 api swagger 文档

![swagger文档](image/swagger.png)

### Demo 控制器

```typescript
import {
  CacheService,
  Controller,
  FromBody,
  FromHeader,
  FromQuery,
  FromRoute,
  HttpDelete,
  HttpGet,
  HttpHead,
  HttpOptions,
  HttpPatch,
  HttpPost,
  HttpPut,
  Injection,
  LoggerService,
} from '@wangminghua/koa-restful';

/**
 * Demo服务
 */
@Controller()
export class DemoController {
  /**
   * 日志
   */
  @Injection()
  logger!: LoggerService;
  /**
   * 缓存
   */
  @Injection()
  cache!: CacheService;

  /**
   * 测试接口，带查询参数
   * @returns
   */
  @HttpGet()
  @HttpPost()
  @HttpPut()
  @HttpDelete()
  @HttpHead()
  @HttpPatch()
  @HttpOptions()
  async test(@FromQuery() name: string = 'hello'): Promise<TestModel> {
    const localeTime = await this.cache.get('localeTime', async () => {
      const locale = new Date().toLocaleString();
      return locale;
    });

    this.logger?.info(`localeTime >>> ${localeTime}`);

    return {
      name: name,
      value: 99,
    };
  }
  /**
   * 提交body
   * @param body
   * @returns
   */
  @HttpPost()
  test1(@FromBody() body: TestModel) {
    return {
      ...body,
      name: 'hello ' + body.name,
    };
  }

  /**
   * 路由参数和请求头参数
   * @param body
   * @returns
   */
  @HttpGet('test2/:id')
  test2(@FromRoute() id: string, @FromHeader() name: string = 'hipy') {
    return {
      id,
      name,
    };
  }
  /**
   * 清理缓存
   * @param cacheKey 缓存Key
   */
  @HttpPost()
  cleanCache(@FromQuery() cacheKey = 'localeTime') {
    this.cache.delete(cacheKey);
  }
}

/**
 * 测试模型
 */
interface TestModel {
  /**
   * 名称
   */
  name: string;
  /**
   * 数据值
   */
  value: number;
}
```
