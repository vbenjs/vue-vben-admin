const Koa = require('koa');
const route = require('koa-route');
const websockify = require('koa-websocket');

const app = websockify(new Koa());

app.ws.use(function (ctx, next) {
  ctx.websocket.send('connection succeeded!');
  return next(ctx);
});

app.ws.use(
  route.all('/test', function (ctx) {
    // ctx.websocket.send('Hello World');
    ctx.websocket.on('message', function (message) {
      // do something with the message from client

      if (message !== 'ping') {
        let data = JSON.stringify({
          id: Math.ceil(Math.random() * 1000),
          time: new Date().getTime(),
          res: `${message}`,
        });
        ctx.websocket.send(data);
      }
      console.log(message);
    });
  })
);

app.listen(3380, () => {
  console.log('websocket server is listen in: ' + 3380);
});
