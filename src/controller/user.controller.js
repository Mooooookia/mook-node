const jwt = require("jsonwebtoken");
const fs = require('fs');

const { PRIVATE_KEY } = require("../app/config");

const { AVATAR_PATH } = require("../constants/file-path")

const userService = require("../service/user.service");
const fileService = require("../service/file.service");
const { SuccessModel, ErrorModel } = require("../model/index");
const { avatarHandler } = require("../middleware/file.middleware");

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
    
    ctx.response.set('content-type', result.mimetype);

    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${result.filename}`);
  }
}

module.exports = new UserController();
