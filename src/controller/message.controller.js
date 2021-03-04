const messageService = require('../service/message.service')
const userService = require('../service/user.service')
const errorTypes = require('../constants/error-types')
const {
  SuccessModel
} = require('../model/index')

class MessageController {
  async sendMessage(ctx, next) {
    const {content, receiverId} = ctx.request.body;
    const {id} = ctx.user;
    const res = await userService.queryBlack(receiverId, id);
    if (res.length) {
      const error = new Error(errorTypes.BLACKED)
      return ctx.app.emit('error', error, ctx);
    }
    const result = await messageService.sendMessage(id, content, receiverId);
    ctx.body = new SuccessModel(result);
  }

  async getMessageInfo(ctx, next) {
    const {messageId} = ctx.params;
    const {id} = ctx.user;
    const result = await messageService.getMessageInfo(messageId);
    ctx.body = new SuccessModel(result);
  }

  async getMessageList(ctx, next) {
    const {offset, limit} = ctx.query;
    const {id} = ctx.user;
    const result = await messageService.getMessageList(id, offset, limit);
    ctx.body = new SuccessModel(result);
  }

  async getMessageRecord(ctx, next) {
    const {userId} = ctx.query;
    const {id} = ctx.user;
    const result = await messageService.getMessageRecord(id, userId);
    ctx.body = new SuccessModel(result);
  }
}

module.exports = new MessageController();