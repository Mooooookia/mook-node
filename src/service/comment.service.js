const connection = require('../app/database');

class CommentService {
  async addComment(userId, articleId, content) {
    const statement = `
      INSERT INTO comment (content, article_id, user_id) VALUES (?, ?, ?);
    `
    const [result] = await connection.execute(statement, [content, articleId, userId]);
    return result;
  }

  async deleteComment(commentId) {
    const statement = `
      DELETE FROM comment WHERE id = ?;
    `
    const [result] = await connection.execute(statement, [commentId]);
    return result;
  }

  async getComment(articleId, offset, limit, order, key, userId) {
    let statement = `
      SELECT c.content, c.id, c.comment_id, c.createAt,
      JSON_OBJECT('id', u.id, 'username', u.username, 'nickname', u.nickname) user,
      (SELECT COUNT(1) FROM user_like_comment WHERE comment_id = c.id) likeCount
      ${!!userId ? `,(SELECT COUNT(1) FROM user_like_comment WHERE user_id = ${userId} AND comment_id = c.id) liked` : ""}
      FROM comment c
      LEFT JOIN user u ON c.user_id = u.id
      WHERE c.article_id = ?
      ORDER BY ${key} ${order}
      LIMIT ?, ?;
    `
    const [result] = await connection.execute(statement, [articleId, offset, limit]);
    statement = `
      SELECT COUNT(1) count
      FROM comment c
      WHERE c.article_id = ?;
    `
    const [res] = await connection.execute(statement, [articleId]);
    return {count: res[0].count, result};
  }

  async addLike(userId, commentId) {
    const statement = `
      INSERT INTO user_like_comment (user_id, comment_id) VALUES (?, ?);
    `
    const [result] = await connection.execute(statement, [userId, commentId]);
    return result;
  }

  async deleteLike(userId, commentId) {
    const statement = `
      DELETE FROM user_like_comment WHERE user_id = ? AND comment_id = ?;
    `
    const [result] = await connection.execute(statement, [userId, commentId]);
    return result;
  }

  async reply(userId, commentId, articleId, content) {
    const statement = `
      INSERT INTO comment (content, article_id, user_id, comment_id) VALUES (?, ?, ?, ?);
    `
    const [result] = await connection.execute(statement, [content, articleId, userId, commentId]);
    return result;
  }
}

module.exports = new CommentService();