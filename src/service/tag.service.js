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
}

module.exports = new TagService();
