const connection = require('../app/database')

class RecommendService {
  async getUserLikeArticle() {
    const statement = `
      SELECT user_id userId, JSON_ARRAYAGG(article_id) articles
      FROM user_like_article
      GROUP BY userId;
    `
    const [result] = await connection.execute(statement, []);
    return result;
  }
  async getArticleCount() {
    const statement = `
      SELECT COUNT(1) count FROM article;
    `
    const [result] = await connection.execute(statement, []);
    return result[0].count;
  }

  async clearRecommend() {
    const statement = `
      DELETE FROM recommend;
    `
    const [result] = await connection.execute(statement,  []);
    return result;
  }

  async addRecommend(userId, articleId) {
    const statement = `
      INSERT INTO recommend (user_id, article_id) VALUES (?, ?);
    `
    const [result] = await connection.execute(statement, [userId, articleId]);
    return result;
  }

  async getRecommend(userId, offset, limit) {
    const statement = `
      SELECT article.id, article.title, article.content, article.view_count viewCount, article.createAt publishTime,
      JSON_OBJECT('id', user.id, 'username', user.username, 'nickname', user.nickname) author,
      (SELECT COUNT(1) FROM user_like_article WHERE article_id = article.id) likeCount,
      (SELECT COUNT(1) FROM \`comment\` WHERE article_id = article.id) commentCount
      FROM recommend
      LEFT JOIN article ON article.id = recommend.article_id
      LEFT JOIN user ON user.id = article.author_id
      WHERE user_id = ?
      LIMIT ?, ?;
    `
    const [result] = await connection.execute(statement, [userId, offset, limit]);
    return result;
  }
}

module.exports = new RecommendService();