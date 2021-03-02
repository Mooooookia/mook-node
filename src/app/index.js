const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const errorHandler = require('./error-handle');
const useRoutes = require('../router');

const app = new Koa();

app.useRoutes = useRoutes;

app.use(bodyParser());
// app.use(async (ctx, next) => {
//   console.log(ctx.request.body);
//   await next();
// })
app.useRoutes();
app.on('error', errorHandler);


module.exports = app;