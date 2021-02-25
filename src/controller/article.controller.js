const articleService = require("../service/article.service");
const { SuccessModel } = require("../model/index");
const articleRouter = require("../router/article.router");

class ArticleController {
  async getArticleList(ctx, next) {
    const { offset, limit, key, order, userId, tag, search } = ctx.query;
    const result = await articleService.getArticleList(
      offset,
      limit,
      userId,
      tag,
      search,
      order,
      key
    );
    ctx.body = new SuccessModel(result);
  }

  async addNewArticle(ctx, next) {
    const { title, content } = ctx.request.body;
    const { id } = ctx.user;
    let result = await articleService.addNewArticle(title, content, id);
    const articleId = result.insertId;

    for (let id of ctx.tags) {
      const result = await articleService.hasTag(articleId, id);
      if (result.length) continue;
      await articleService.addTag(articleId, id);
    }

    ctx.body = new SuccessModel(result);
  }

  async changeArticle(ctx, next) {
    const { articleId: id } = ctx.params;
    const { title, content } = ctx.request.body;
    await articleService.clearTags(id);
    await articleService.changeArticle(id, title, content);
    for (let tagId of ctx.tags) {
      await articleService.addTag(id, tagId);
    }
    ctx.body = new SuccessModel();
  }

  async deleteArticle(ctx, next) {
    const {articleId: id} = ctx.params;
    const result = await articleService.deleteArticle(id);
    ctx.body = new SuccessModel();
  }

  async getArticleInfo(ctx, next) {
    const {id} = ctx.params;
    const userId = ctx.user.id;
    const result = await articleService.getArticleInfo(id, userId);
    ctx.body = result;
  }

  async addLike(ctx, next) {
    const {articleId} = ctx.request.body;
    const {id} = ctx.user;
    const result = await articleService.addLike(id, articleId);
    ctx.body = new SuccessModel(result);
  }

  async deleteLike(ctx, next) {
    const {articleId} = ctx.request.body;
    const {id} = ctx.user;
    const result = await articleService.deleteLike(id, articleId);
    
    ctx.body = new SuccessModel(result);
  }

  async getLike(ctx, next) {
    const {userId, offset, limit} = ctx.query;
    const result = await articleService.getLike(userId, offset, limit);
    ctx.body = new SuccessModel(result);
  }

  async addCollection(ctx, next) {
    const {articleId} = ctx.request.body;
    const {id} = ctx.user;
    const result = await articleService.addCollection(id, articleId);
    ctx.body = new SuccessModel(result);
  }

  async deleteCollection(ctx, next) {
    const {articleId} = ctx.request.body;
    const {id} = ctx.user;
    const result = await articleService.deleteCollection(id, articleId);
    
    ctx.body = new SuccessModel(result);
  }

  async getCollection(ctx, next) {
    const {userId, offset, limit} = ctx.query;
    const result = await articleService.getCollection(userId, offset, limit);
    ctx.body = new SuccessModel(result);
  }
}

module.exports = new ArticleController();
