const connection = require('../app/database');

class UserService {
  async create(user) {
    const { username, password } = user;
    const statement = `INSERT INTO user (username, password, nickname) VALUES (?, ?, ?);`;
    const result = await connection.execute(statement, [username, password, username]);

    return result[0];
  }

  async getUserByUsername(username) {
    const statement = `SELECT * FROM user WHERE username = ?;`;
    const result = await connection.execute(statement, [username]);
    return result[0];
  }
}

module.exports = new UserService();