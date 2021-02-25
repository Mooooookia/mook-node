const connection = require('../app/database')

class TagService {
  async getTagByContent(content) {
    const statement = `
      SELECT * FROM tag WHERE content = ?;
    `
    const [result] = await connection.execute(statement, [content]);
    return result;
  }

  async addTag(content) {
    const statement = `
      INSERT INTO tag (content) VALUES (?);
    `
    const [result] = await connection.execute(statement, [content]);
    return result;
  }

  async getTag(offset, limit, order, key, search = "%") {
    const statement = `
      SELECT tag.id, tag.content,
      COUNT(watch.id) watch,
      (SELECT COUNT(1) FROM article_tag WHERE tag_id = tag.id) article
      FROM tag
      LEFT JOIN watch ON watch.tag_id = tag.id
      WHERE tag.content LIKE "%${search}%"
      GROUP BY tag.id
      ORDER BY ${key} ${order}
      LIMIT ?, ?;
    `
    const [result] = await connection.execute(statement, [offset, limit]);
    return result;
  }

  async addWatch(userId, tagId) {
    const statement = `
      INSERT INTO watch (user_id, tag_id) VALUES (?, ?);
    `
    const [result] = await connection.execute(statement, [userId, tagId]);
    return result;
  }

  async deleteWatch(userId, tagId) {
    const statement = `
      DELETE FROM watch WHERE user_id = ? AND tag_id = ?;
    `
    const [result] = await connection.execute(statement, [userId, tagId]);
    return result;
  }
}

module.exports = new TagService();
