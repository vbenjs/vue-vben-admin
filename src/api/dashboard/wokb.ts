import http from '@/utils/http/axios';
import {
  ProdItem,
  WokbAllRsltModel,
  ListRsltModel,
  TodoItem,
  DplyItem,
  NewsItem,
} from './model/wokbModel';

enum Api {
  WokbProdList = '/wokb/product',
  WokbTodoList = '/wokb/todoList',
  WokbDplyList = '/wokb/deployList',
  WokbNewsList = '/wokb/newsList',
  // WokbFileList = '/wokb/fileList',
  // announcement，公告
  // WokbAnnoList = '/wokb/annoList',
  WokbAllData = '/wokb/allData',
}
/**
 * @description: 产品数量
 */
export function wokbAllDataApi() {
  return http.request<WokbAllRsltModel>(
    {
      url: Api.WokbAllData,
      method: 'POST',
    },
    {
      // 登陆接口不加 /v1.0
      joinPrefix: false,
    }
  );
}

/**
 * @description: 产品数量
 */
export function wokbProdListApi() {
  return http.request<ProdItem[]>(
    {
      url: Api.WokbProdList,
      method: 'POST',
    },
    {
      // 登陆接口不加 /v1.0
      joinPrefix: false,
    }
  );
}

/**
 * @description: 代办事项
 */
export function wokbTodoListApi() {
  return http.request<ListRsltModel<TodoItem>>(
    {
      url: Api.WokbTodoList,
      method: 'POST',
    },
    {
      // 登陆接口不加 /v1.0
      joinPrefix: false,
    }
  );
}
/**
 * @description: 部署记录
 */
export function wokbDplyListApi() {
  return http.request<ListRsltModel<DplyItem>>(
    {
      url: Api.WokbDplyList,
      method: 'POST',
    },
    {
      // 登陆接口不加 /v1.0
      joinPrefix: false,
    }
  );
}
/**
 * @description: 动态
 */
export function wokbNewsListApi() {
  return http.request<ListRsltModel<NewsItem>>(
    {
      url: Api.WokbNewsList,
      method: 'POST',
    },
    {
      // 登陆接口不加 /v1.0
      joinPrefix: false,
    }
  );
}
