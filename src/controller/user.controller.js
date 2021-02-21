const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../app/config");

const userService = require("../service/user.service");
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
}

module.exports = new UserController();
