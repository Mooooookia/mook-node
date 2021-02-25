const tagService = require('../service/tag.service')
const {
  SuccessModel
} = require('../model/index')

class TagController {
  async getTag(ctx, next) {
    const {offset, limit, order, key, search} = ctx.query;
    const result = await tagService.getTag(offset, limit, order, key, search);
    ctx.body = new SuccessModel(result)
  }

  async addWatch(ctx, next) {
    const {tagId} = ctx.request.body;
    const {id} = ctx.user;
    const result = await tagService.addWatch(id, tagId);
    ctx.body = new SuccessModel(result);
  }
  
  async deleteWatch(ctx, next) {
    const {tagId} = ctx.request.body;
    const {id} = ctx.user;
    const result = await tagService.deleteWatch(id, tagId);
    ctx.body = new SuccessModel(result);
  }
}

module.exports = new TagController();