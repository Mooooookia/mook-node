const commentService = require('../service/comment.service')
const {
  SuccessModel
} = require('../model/index')

class CommentController {
  async addComment(ctx, next) {
    const {content, articleId} = ctx.request.body;
    const {id} = ctx.user;
    const result = await commentService.addComment(id, articleId, content);
    ctx.body = new SuccessModel(result);
  }

  async deleteComment(ctx, next) {
    const {commentId} = ctx.params;
    const result = await commentService.deleteComment(commentId);
    ctx.body = new SuccessModel(result);
  }

  async getComment(ctx, next) {
    const {articleId, offset, limit, order, key, userId} = ctx.query;
    const result = await commentService.getComment(articleId, offset, limit, order, key, userId);
    ctx.body = new SuccessModel(result);
  }

  async addLike(ctx, next) {
    const {commentId} = ctx.request.body;
    const {id} = ctx.user;
    const result = await commentService.addLike(id, commentId);
    ctx.body = new SuccessModel(result);
  }

  async deleteLike(ctx, next) {
    const {commentId} = ctx.request.body;
    const {id} = ctx.user;
    const result = await commentService.deleteLike(id, commentId);
    ctx.body = new SuccessModel(result);
  }

  async reply(ctx, next) {
    const {commentId, content, articleId} = ctx.request.body;
    const {id} = ctx.user;
    const result = await commentService.reply(id, commentId, articleId, content);
    ctx.body = new SuccessModel(result);
  }
}


module.exports = new CommentController();