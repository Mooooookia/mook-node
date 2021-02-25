const connection = require('../app/database')

class AuthService {
  async checkPermission(tableName, id, userId) {
    const statement = `
      SELECT * FROM ${tableName} WHERE id = ? AND author_id = ?;
    `
    const [result] = await connection.execute(statement, [id, userId]);
    return result;
  }
}

module.exports = new AuthService();