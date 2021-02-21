const connection = require("../app/database");

class UserService {
  async create(user) {
    const { username, password } = user;
    const statement = `INSERT INTO user (username, password, nickname) VALUES (?, ?, ?);`;
    const [result] = await connection.execute(statement, [
      username,
      password,
      username,
    ]);

    return result;
  }

  async getUserByUsername(username) {
    const statement = `SELECT * FROM user WHERE username = ?;`;
    const [result] = await connection.execute(statement, [username]);
    return result;
  }

  async getUserInfo(userId) {
    const statement = `SELECT * FROM user WHERE id = ?;`;
    const [result] = await connection.execute(statement, [userId]);
    return result[0];
  }

  async getAuthorInfo(userId) {
    const statement = `SELECT id, username, nickname, gender, qq, email, introduction, score, word_count, like_count, reward_count FROM user WHERE id = ?;`;
    const [result] = await connection.execute(statement, [userId]);
    return result[0];
  }

  async changeUserInfo(userId, { nickname, gender, qq, email, introduction }) {
    const statement = `UPDATE user SET nickname = ?, gender = ?, qq = ?, email = ?, introduction = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [
      nickname,
      gender,
      qq,
      email,
      introduction,
      userId,
    ]);
    return result;
  }

  async changePassword(userId, password) {
    const statement = `UPDATE user SET password = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [password, userId]);
    return result;
  }

}

module.exports = new UserService();
