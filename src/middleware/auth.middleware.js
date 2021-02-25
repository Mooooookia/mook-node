const jwt = require('jsonwebtoken');

const errorTypes = require('../constants/error-types')
const { PUBLIC_KEY } = require('../app/config');
const authService = require('../service/auth.service')

const verifyToken = async (ctx, next) => {
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit('error', error, ctx);
  }
  const token = authorization.replace('Bearer ', '');
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"]
    });
    ctx.user = result;
    await next();
  } catch (err) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    ctx.app.emit('error', error, ctx);
  }
}

const verifyPermission = async (ctx, next) => {
  const [resourceKey] = Object.keys(ctx.params);
  const tableName = resourceKey.replace('Id', '');
  const resourceId = ctx.params[resourceKey];
  const {id} = ctx.user;
  let idName = 'user';
  switch(tableName) {
    case "article":
      idName = "author";
      break;
    default:
      idName = "user";
  }
  try {
    const result = await authService.checkPermission(tableName, resourceId, id, idName);
    if (!result.length) throw new Error();
    await next();
  } catch(err) {
    const error = new Error(errorTypes.NO_PERMISSION);
    ctx.app.emit('error', error, ctx);
  }

}

const getUserByToken = async (ctx, next) => {
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    ctx.user = {}
    await next();
    return;
  }
  const token = authorization.replace('Bearer ', '');
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"]
    });
    ctx.user = result;
  } catch (err) {ctx.user = {}}
  await next();
}

const verifyMessage = async (ctx, next) => {
  const {id} = ctx.user;
  const {messageId} = ctx.params;
  const result = await authService.checkMessage(id, messageId);
  if (!result.length) {
    const error = new Error(errorTypes.NO_PERMISSION);
    return ctx.app.emit('error', error, ctx);
  }
  await next();
} 

module.exports = {
  verifyToken,
  verifyPermission,
  getUserByToken,
  verifyMessage
}