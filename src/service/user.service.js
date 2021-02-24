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
    const statement = `
      SELECT u.*, COUNT(f.id) following, (SELECT COUNT(*) FROM follow WHERE user2_id = u.id) follower
      FROM user u
      LEFT JOIN follow f ON f.user1_id = u.id
      WHERE u.id = ?;
    `;
    const [result] = await connection.execute(statement, [userId]);
    return result[0];
  }

  async getAuthorInfo(userId) {
    const statement = `
      SELECT u.id, u.username, u.nickname, u.gender, u.qq, u.email, u.introduction, u.score, u.word_count, u.like_count, u.reward_count, COUNT(f.id) following, (SELECT COUNT(*) FROM follow WHERE user2_id = u.id) follower 
      FROM user u
      LEFT JOIN follow f ON f.user1_id = u.id
      WHERE u.id = ?;
    `;
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

  async addFollow(user1Id, user2Id) {
    const statement = `INSERT INTO follow (user1_id, user2_id) VALUES (?, ?);`;
    const [result] = await connection.execute(statement, [user1Id, user2Id]);
    return result;
  }

  async deleteFollow(user1Id, user2Id) {
    const statement = `DELETE FROM follow WHERE user1_id = ? AND user2_id = ?;`;
    const [result] = await connection.execute(statement, [user1Id, user2Id]);
    return result;
  }

  async getFollowing(userId, offset, limit) {
    let statement = `
      SELECT u.id userId, u.username, u.nickname, u.word_count, u.like_count, u.reward_count FROM follow f
      JOIN user u ON u.id = f.user2_id
      WHERE user1_id = ? LIMIT ?, ?;
    `;
    const [result] = await connection.execute(statement, [
      userId,
      offset,
      limit,
    ]);
    statement = `
      SELECT COUNT(*) count FROM follow WHERE user1_id = ?;
    `;
    const [res] = await connection.execute(statement, [userId]);
    return { count: res[0].count, result };
  }

  async getFollower(userId, offset, limit) {
    let statement = `
      SELECT u.id userId, u.username, u.nickname, u.word_count, u.like_count, u.reward_count FROM follow f
      JOIN user u ON u.id = f.user1_id
      WHERE user2_id = ? LIMIT ?, ?;
    `;
    const [result] = await connection.execute(statement, [
      userId,
      offset,
      limit,
    ]);
    statement = `
      SELECT COUNT(*) count FROM follow WHERE user2_id = ?;
    `;
    const [res] = await connection.execute(statement, [userId]);
    return { count: res[0].count, result };
  }

  async getUserList(order, key, offset, limit, search) {
    let statement = `
      SELECT u.id userId, u.username, u.nickname, u.word_count word, u.like_count \`like\`, (SELECT COUNT(*) FROM follow WHERE user2_id = u.id) follower
      FROM user u
      WHERE u.username LIKE "%${search}%"
      ORDER BY ${key} ${order}
      LIMIT ?, ?;
    `;
    const [result] = await connection.execute(statement, [offset, limit]);
    statement = `
      SELECT COUNT(1) count, (SELECT COUNT(*) FROM follow WHERE user2_id = u.id) follower
      FROM user u
      WHERE u.username LIKE "%${search}%"
    `
    const [res] = await connection.execute(statement, []);
    return {count: res[0].count, result};
  }

  async addBlack(user1Id, user2Id) {
    const statement = `
      INSERT INTO blacklist (user1_id, user2_id) VALUES (?, ?);
    `
    const [result] = await connection.execute(statement, [user1Id, user2Id]);
    return result;
  }

  async deleteBlack(user1Id, user2Id) {
    const statement = `
      DELETE FROM blacklist WHERE user1_id = ? && user2_id = ?;
    `
    const [result] = await connection.execute(statement, [user1Id, user2Id])
    return result;
  }

  async getBlack(userId) {
    const statement = `
      SELECT u.id userId, u.username, u.nickname, u.word_count word, u.like_count \`like\`, (SELECT COUNT(*) FROM follow WHERE user2_id = u.id) follower
      FROM blacklist b
      JOIN user u ON u.id = b.user2_id
      WHERE b.user1_id = ?;
    `
    const [result] = await connection.execute(statement, [userId]);
    return result;
  }

  async getAction(userId, offset = 0, limit) {
    const statement = `
      SELECT a.type, JSON_OBJECT('id', u.id, 'username', u.username, 'nickname', u.nickname) author,
      JSON_OBJECT('articleId', art.id, 'title', art.title) article
      FROM action a
      LEFT JOIN user u ON a.author_id = u.id
      LEFT JOIN article art ON a.article_id = art.id
      WHERE a.user_id = ?
      LIMIT ?, ?;
    `
    const [result] = await connection.execute(statement, [userId, offset, limit]);
    return result;
  }
}

module.exports = new UserService();
