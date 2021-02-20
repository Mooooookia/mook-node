const errorTypes = require('../constants/error-types')

const errorHandler = (error, ctx) => {
  let status, message;

  switch (error.message) {
    case errorTypes.UNAUTHORIZATION:
      status = 401;
      message = "未授权"
      break;
    default:
      status = 404;
      message = "NOT FOUND";
  }

  ctx.status = status;
  ctx.body = message;
}

module.exports = errorHandler;