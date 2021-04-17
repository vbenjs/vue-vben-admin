/*
 * @Author: your name
 * @Date: 2021-04-17 13:05:31
 * @LastEditTime: 2021-04-17 13:21:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /evan-admin/test/server/api/app.js
 */
const Koa = require('koa');
const router = require('koa-router')();
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

app.use(cors());
app.use(bodyParser());

router.get('/getTest', (ctx) => {
  ctx.body = {
    name: 'test',
  };
});

router.post('/login', (ctx) => {
  ctx.body = {
    code: 0,
    success: true,
    result: {
      userId: '1',
      username: 'evan',
      realName: 'Evan Admin',
      desc: 'manager',
      password: '123456',
      token: 'fakeToken1',
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super',
        },
      ],
    },
  };
});

router.get('/getUserInfoById', (ctx) => {
  ctx.body = {
    code: 0,
    success: true,
    result: {
      userId: '1',
      username: 'evan',
      realName: 'Evan Admin',
      desc: 'manager',
      password: '123456',
      token: 'fakeToken1',
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super',
        },
      ],
    },
  };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3002, () => {
  console.log('server is listen in 3002');
});
