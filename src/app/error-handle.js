const errorTypes = require('../constants/error-types')
const {
  ErrorModel
} = require('../model/index')

const errorHandler = (error, ctx) => {
  let status, message;
  switch (error.message) {
    case errorTypes.UNAUTHORIZATION:
      status = 401;
      message = "未授权"
      break;
    case errorTypes.USERNAME_FORMAT:
      status = 400;
      message = "用户名格式错误"
      break;
    case errorTypes.PASSWORD_FORMAT:
      status = 400;
      message = "密码格式错误"
      break;
    case errorTypes.USERNAME_EXIST:
      status = 409; // conflict
      message = "用户名已存在"
      break;
    case errorTypes.USERNAME_NOT_EXIST:
      status = 400;
      message = "用户名不存在"
      break;
    case errorTypes.PASSWORD_INCORRECT:
      status = 400;
      message = "密码错误"
      break;
    case errorTypes.NO_PERMISSION:
      status = 401;
      message = "没有权限";
      break;
    case errorTypes.BLACKED:
      status = 401;
      message = "您已被对方拉黑";
      break;
    default:
      status = 404;
      message = "404 NOT FOUND";
  }

  ctx.status = status;
  ctx.body = new ErrorModel({
    errno: status,
    message
  });
}

module.exports = errorHandler;