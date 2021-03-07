const recommendService = require('../service/recommend.service')
const {
  SuccessModel
} = require('../model/index')

class RecommendController {
  async getRecommend(ctx, next) {
    const {id} = ctx.user
    const {offset, limit} = ctx.query
    const result = await recommendService.getRecommend(id, offset, limit);
    ctx.body = new SuccessModel(result)
  }
}

module.exports = new RecommendController();