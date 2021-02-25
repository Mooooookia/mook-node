const connection = require('../app/database')

class ArticleService {
  async getArticleList(offset, limit, userId, tag, search, order, key) {
    let condition = "";
    if (userId) condition = `article.author_id = ${userId}`;
    if (tag) condition = `tag.content = ${tag}`;
    if (search) condition = `article.title LIKE "%${search}%" || article.content LIKE "%${search}%"`
    let statement = `
      SELECT article.id, article.title, article.content, article.view_count viewCount, article.createAt publishTime,
      JSON_OBJECT('id', user.id, 'username', user.username, 'nickname', user.nickname) author,
      (SELECT COUNT(1) FROM user_like_article WHERE article_id = article.id) likeCount,
      (SELECT COUNT(1) FROM \`comment\` WHERE article_id = article.id) commentCount
      FROM article
      LEFT JOIN user ON user.id = article.author_id
      ${!!tag ? `LEFT JOIN article_tag ON article_id = article.id
      LEFT JOIN tag ON tag.id = article_tag.tag_id` : ""}
      WHERE ${condition} 
      ORDER BY ${key} ${order}
      LIMIT ?, ?;
    `
    const [result] = await connection.execute(statement, [offset, limit]);
    
    statement = `
      SELECT COUNT(1) count
      FROM article
      LEFT JOIN user ON user.id = article.author_id
      ${!!tag ? `LEFT JOIN article_tag ON article_id = article.id
      LEFT JOIN tag ON tag.id = article_tag.tag_id` : ""}
      WHERE ${condition};
    `
    const [res] = await connection.execute(statement, []);
    return {count: res[0].count, result};
  }
  
  async addNewArticle(title, content, userId) {
    const statement = `
      INSERT INTO article (title, content, author_id) VALUES (?, ?, ?);
    `
    const [result] = await connection.execute(statement, [title, content, userId]);
    return result;
  }

  async changeArticle(articleId, title, content) {
    const statement = `
      UPDATE article SET title = ?, content = ? WHERE id = ?;
    `
    const [result] = await connection.execute(statement, [title, content, articleId]);
    return result;
  }

  async hasTag(articleId, tagId) {
    const statement = `
      SELECT * FROM article_tag WHERE article_id = ? AND tag_id = ?;
    `
    const [result] = await connection.execute(statement, [articleId, tagId]);
    return result;
  }

  async addTag(articleId, tagId) {
    const statement = `
      INSERT INTO article_tag (article_id, tag_id) VALUES (?, ?);
    `
    const result = await connection.execute(statement, [articleId, tagId]);
    return result;
  }

  async deleteTag(articleId, tagId) {
    const statement = `
      DELETE FROM article_tag WHERE article_id = ? AND tag_id = ?;
    `
    const [result] = await connection.execute(statement, [articleId, tagId]);
    return result;
  }

  async clearTags(articleId) {
    const statement = `
      DELETE FROM article_tag WHERE article_id = ?;
    `
    const [result] = await connection.execute(statement, [articleId]);
    return result;
  }

  async deleteArticle(articleId) {
    const statement = `
      DELETE FROM article WHERE id = ?;
    `
    const [result] = await connection.execute(statement, [articleId]);
    return result;
  }

  async getArticleInfo(articleId) {
    const statement = `
      SELECT article.*,
      JSON_OBJECT('id', user.id, 'username', user.username, 'nickname', user.nickname) author,
      (SELECT COUNT(1) FROM user_like_article WHERE article_id = article.id) likeCount,
      IF(COUNT(tag.id),JSON_ARRAYAGG(JSON_OBJECT('id', tag.id, 'content', tag.content)),NULL) tags
      FROM article
      LEFT JOIN user ON user.id = article.author_id
      LEFT JOIN article_tag ON article_id = article.id
      LEFT JOIN tag ON article_tag.tag_id = tag.id
      WHERE article.id = ?
      GROUP BY article.id 
    `
    const [result] = await connection.execute(statement, [articleId]);
    return result[0];
  }

  async addLike(userId, articleId) {
    const statement = `
      INSERT INTO user_like_article (user_id, article_id) VALUES (?, ?);
    `
    const [result] = await connection.execute(statement, [userId, articleId]);
    return result;
  }

  async deleteLike(userId, articleId) {
    const statement = `
      DELETE FROM user_like_article WHERE user_id = ? AND article_id = ?;
    `
    const [result] = await connection.execute(statement, [userId, articleId]);
    return result;
  }

  async getLike(userId, offset, limit) {
    let statement = `
      SELECT article.id, article.title, article.content, article.createAt, article.view_count,
      JSON_OBJECT('id', user.id, 'username', user.username, 'nickname', user.nickname) author,
      (SELECT COUNT(1) FROM user_like_article WHERE article_id = article.id) likeCount,
      (SELECT COUNT(1) FROM comment WHERE article_id = article.id) commentCount
      FROM user_like_article
      LEFT JOIN article ON article.id = user_like_article.article_id
      LEFT JOIN user ON user.id = article.author_id
      WHERE user_like_article.user_id = ?
      ORDER BY user_like_article.createAt desc
      LIMIT ?, ?;
    `
    const [result] = await connection.execute(statement, [userId, offset, limit]);
    statement = `
      SELECT COUNT(1) count
      FROM user_like_article
      WHERE user_id = ?
    `
    const [res] = await connection.execute(statement, [userId]);
    return {count: res[0].count, result};
  }

  async addCollection(userId, articleId) {
    const statement = `
      INSERT INTO user_collect_article (user_id, article_id) VALUES (?, ?);
    `
    const [result] = await connection.execute(statement, [userId, articleId]);
    return result;
  }

  async deleteCollection(userId, articleId) {
    const statement = `
      DELETE FROM user_collect_article WHERE user_id = ? AND article_id = ?;
    `
    const [result] = await connection.execute(statement, [userId, articleId]);
    return result;
  }

  async getCollection(userId, offset, limit) {
    let statement = `
      SELECT article.id, article.title, article.content, article.createAt, article.view_count,
      JSON_OBJECT('id', user.id, 'username', user.username, 'nickname', user.nickname) author,
      (SELECT COUNT(1) FROM user_like_article WHERE article_id = article.id) likeCount,
      (SELECT COUNT(1) FROM comment WHERE article_id = article.id) commentCount
      FROM user_collect_article
      LEFT JOIN article ON article.id = user_collect_article.article_id
      LEFT JOIN user ON user.id = article.author_id
      WHERE user_collect_article.user_id = ?
      ORDER BY user_collect_article.createAt desc
      LIMIT ?, ?;
    `
    const [result] = await connection.execute(statement, [userId, offset, limit]);
    statement = `
      SELECT COUNT(1) count
      FROM user_collect_article
      WHERE user_id = ?
    `
    const [res] = await connection.execute(statement, [userId]);
    return {count: res[0].count, result};
  }
}
module.exports = new ArticleService();