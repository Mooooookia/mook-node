const connection = require('../app/database')

class AuthService {
  async checkPermission(tableName, id, userId, idName) {
    const statement = `
      SELECT * FROM ${tableName} WHERE id = ? AND ${idName}_id = ?;
    `
    const [result] = await connection.execute(statement, [id, userId]);
    return result;
  }

  async checkMessage(userId, messageId) {
    const statement = `
      SELECT *
      FROM message
      WHERE id = ? AND (sender_id = ? OR receiver_id = ?);
    `
    const [result] = await connection.execute(statement, [messageId, userId, userId]);
    return result;
  }
}

module.exports = new AuthService();