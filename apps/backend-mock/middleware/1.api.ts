export default defineEventHandler((event) => {
  // setResponseHeaders(event, {
  //   'Access-Control-Allow-Credentials': 'true',
  //   'Access-Control-Allow-Headers': '*',
  //   'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Expose-Headers': '*',
  // });
  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 204;
    event.node.res.statusMessage = 'No Content.';
    return 'OK';
  }
});
