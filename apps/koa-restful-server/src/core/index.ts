import './env'; // 加载环境变量

import {
  AddAuthentication,
  DefaultControllerOptions,
  IAuthorization,
} from '@wangminghua/koa-restful';
import { AddSwaggerUI } from '@wangminghua/koa-restful-extra';
import { Context } from 'koa';
import { OpenAPIV3 } from 'openapi-types';

// DefaultControllerOptions.defaultRoutePrefix = 'basic-api'
DefaultControllerOptions.defaultRoutePrefix = '';

class BasicAuthorization implements IAuthorization {
  public static readonly scheme: string = 'Basic';
  /**
   * authorityHeader
   */
  get authorityHeader(): string {
    return 'Authorization';
  }
  /**
   * SecuritySchemeObject
   */
  get securitySchemeObject(): OpenAPIV3.SecuritySchemeObject {
    return {
      type: 'apiKey',
      in: 'header',
      name: this.authorityHeader,
    };
  }
  async hook(ctx: Context): Promise<boolean> {
    const { authorityHeader } = this;
    const token = ctx.get(authorityHeader);
    if (!token) return false;
    try {
      this.verify(token);
      return true;
    } catch (err) {
      return false;
    }
  }
  verify(token: string) {
    const tokens = ['fakeToken1', 'fakeToken2'];
    return tokens.includes(token);
  }
}

const authentication = AddAuthentication(BasicAuthorization.scheme, new BasicAuthorization());

AddSwaggerUI('./src/**/*.ts').addSecurityScheme(
  BasicAuthorization.scheme,
  authentication.securitySchemeObject,
); // 加载swagger服务
