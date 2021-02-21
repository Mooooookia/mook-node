const jwt = require("jsonwebtoken");
const fs = require("fs");

const { PRIVATE_KEY } = require("../app/config");
const { AVATAR_PATH } = require("../constants/file-path");
const errorTypes = require('../constants/error-types');

const userService = require("../service/user.service");
const fileService = require("../service/file.service");
const { SuccessModel, ErrorModel } = require("../model/index");

class UserController {
  async register(ctx, next) {
    const user = ctx.request.body;
    try {
      const result = await userService.create(user);
      ctx.body = new SuccessModel();
    } catch (err) {
      ctx.body = new ErrorModel({
        errno: err.errno,
        message: err.sqlMessage,
      });
    }
  }
  async login(ctx, next) {
    const { id, username } = ctx.user;
    const token = jwt.sign({ id, username }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24 * 7,
      algorithm: "RS256",
    });
    ctx.body = new SuccessModel({ id, username, token });
  }

  async getAvatar(ctx, next) {
    const { userId } = ctx.params;
    const result = await fileService.getAvatarByUserId(userId);

    ctx.response.set("content-type", result.mimetype);

    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${result.filename}`);
  }

  async userInfo(ctx, next) {
    const { id } = ctx.user;
    const result = await userService.getUserInfo(id);
    ctx.body = new SuccessModel(result);
  }

  async authorInfo(ctx, next) {
    const { userId } = ctx.params;
    const result = await userService.getAuthorInfo(userId);
    ctx.body = new SuccessModel(result);
  }

  async changeInfo(ctx, next) {
    const { id } = ctx.user;
    const result = await userService.changeUserInfo(id, ctx.request.body);
    ctx.body = new SuccessModel();
  }

  async changePassword(ctx, next) {
    const {id, username} = ctx.user;
    const {oldPassword, newPassword} = ctx.request.body;
    let result = await userService.getUserByUsername(username);
    if (result[0].password !== oldPassword) {
      const error = new Error(errorTypes.PASSWORD_INCORRECT);
      return ctx.app.emit('error', error, ctx);
    }
    result = await userService.changePassword(id, newPassword);
    ctx.body = new SuccessModel();
  }
}

module.exports = new UserController();
