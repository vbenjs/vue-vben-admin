import { FullLoading } from '@/components/loading/index';
import LoadTimeOut from '@/views/sys/exception/LoadTimeOut.vue';

/**
 * @description:  页面切换显示的加载页面
 */
export const LOADING_PAGE = FullLoading;

/**
 * @description:  切换切换超时页面
 */
export const TIMEOUT_PAGE = LoadTimeOut;

/**
 * @description: 切换页面如果指定时间没响应,则显示loading页面
 * 400毫秒
 */
export const DELAY = 400;

/**
 * @description: 切换页面如果超过指定时间没响应,则显示超时页面
 * 10秒
 */
export const TIMEOUT = 60 * 1000;
