const messageService = require('../service/message.service')
const {
  SuccessModel
} = require('../model/index')

class MessageController {
  async sendMessage(ctx, next) {
    const {content, receiverId} = ctx.request.body;
    const {id} = ctx.user;
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
    const {offset, limit, idName} = ctx.query;
    const {id} = ctx.user;
    const result = await messageService.getMessageList(idName, id, offset, limit);
    ctx.body = new SuccessModel(result);
  }
}

module.exports = new MessageController();