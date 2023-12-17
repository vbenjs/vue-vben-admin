/*
 * 加载环境变量
 * @Author: wangminghua
 * @Date: 2023-12-11 20:42:52
 */

import dotenv from 'dotenv';

const NODE_ENV = process.env.NODE_ENV;

dotenv.config();
if (NODE_ENV) dotenv.config({ path: `.env.${NODE_ENV}`, override: true });
