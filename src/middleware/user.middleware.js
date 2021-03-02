const errorTypes = require("../constants/error-types");
const userService = require("../service/user.service");
const md5password = require("../utils/encrypt");

const verifyUser = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  const format = /^\w{6,16}$/;
  if (!format.test(username)) {
    const error = new Error(errorTypes.USERNAME_FORMAT);
    return ctx.app.emit("error", error, ctx);
  }

  if (!format.test(password)) {
    const error = new Error(errorTypes.PASSWORD_FORMAT);
    return ctx.app.emit("error", error, ctx);
  }

  const result = await userService.getUserByUsername(username);
  if (result.length) {
    const error = new Error(errorTypes.USERNAME_EXIST);
    return ctx.app.emit("error", error, ctx);
  }
  
  await next();
};

const encryptPassword = async (ctx, next) => {
  const { password } = ctx.request.body;
  if (password) ctx.request.body.password = md5password(password);

  if (ctx.request.body.oldPassword)
    ctx.request.body.oldPassword = md5password(ctx.request.body.oldPassword);
  if (ctx.request.body.newPassword)
    ctx.request.body.newPassword = md5password(ctx.request.body.newPassword);

  await next();
};

const verifyLogin = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  const format = /^\w{6,16}$/;
  if (!format.test(username)) {
    const error = new Error(errorTypes.USERNAME_FORMAT);
    return ctx.app.emit("error", error, ctx);
  }

  if (!format.test(password)) {
    const error = new Error(errorTypes.PASSWORD_FORMAT);
    return ctx.app.emit("error", error, ctx);
  }
  const result = await userService.getUserByUsername(username);
  if (!result.length) {
    const error = new Error(errorTypes.USERNAME_EXIST);
    return ctx.app.emit("error", error, ctx);
  }
  const user = result[0];
  if (md5password(String(password)) !== user.password) {
    const error = new Error(errorTypes.PASSWORD_INCORRECT);
    return ctx.app.emit("error", error, ctx);
  }
  
  ctx.user = user;
  await next();
};

const verifyNewPassword = async (ctx, next) => {
  const { newPassword = "" } = ctx.request.body;
  const format = /^\w{6,16}$/;

  if (!format.test(newPassword)) {
    const error = new Error(errorTypes.PASSWORD_FORMAT);
    return ctx.app.emit("error", error, ctx);
  }
  await next();
};

module.exports = {
  verifyUser,
  encryptPassword,
  verifyLogin,
  verifyNewPassword,
};
