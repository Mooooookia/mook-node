const connection = require('../app/database')

class AuthService {
  async checkPermission(tableName, id, userId, userOrAuthor) {
    const statement = `
      SELECT * FROM ${tableName} WHERE id = ? AND ${userOrAuthor}_id = ?;
    `
    const [result] = await connection.execute(statement, [id, userId]);
    return result;
  }
}

module.exports = new AuthService();