const connection = require('../app/database')

class MessageService {
  async sendMessage(senderId, content, receiverId) {
    const statement = `
      INSERT INTO message (content, sender_id, receiver_id) VALUES (?, ?, ?);
    `
    const [result] = await connection.execute(statement, [content, senderId, receiverId])
    return result;
  }

  async getMessageInfo(messageId) {
    const statement = `
      SELECT message.id, message.content, message.createAt,
      JSON_OBJECT('id', s.id, 'username', s.username, 'nickname', s.nickname) sender,
      JSON_OBJECT('id', r.id, 'username', r.username, 'nickname', r.nickname) receiver
      FROM message
      LEFT JOIN user s ON message.sender_id = s.id
      LEFT JOIN user r ON message.receiver_id = r.id
      WHERE message.id = ?;
    `
    const [result] = await connection.execute(statement, [messageId]);
    return result[0];
  }

  async getMessageList(userId, offset, limit) {
    let statement = `
      SELECT message.id, message.content, message.createAt,
      JSON_OBJECT('id', s.id, 'username', s.username, 'nickname', s.nickname) sender,
      JSON_OBJECT('id', r.id, 'username', r.username, 'nickname', r.nickname) receiver
      FROM message
      LEFT JOIN user s ON message.sender_id = s.id
      LEFT JOIN user r ON message.receiver_id = r.id
      WHERE message.sender_id = ? OR message.receiver_id = ?
      ORDER BY message.id DESC
      LIMIT ?, ?;
    `
    const [result] = await connection.execute(statement, [userId, userId, offset, limit]);
    statement = `
      SELECT COUNT(1) count
      FROM message
      WHERE message.sender_id = ? OR message.receiver_id = ?
    `
    const [res] = await connection.execute(statement, [userId, userId]);

    return {count: res[0].count, result};
  }

  async getMessageRecord(user1Id, user2Id) {
    const statement = `
      SELECT message.id, message.content, message.createAt,
      JSON_OBJECT('id', s.id, 'username', s.username, 'nickname', s.nickname) sender,
      JSON_OBJECT('id', r.id, 'username', r.username, 'nickname', r.nickname) receiver
      FROM message
      LEFT JOIN user s ON message.sender_id = s.id
      LEFT JOIN user r ON message.receiver_id = r.id
      WHERE (message.sender_id = ? AND message.receiver_id = ?) OR (message.sender_id = ? AND message.receiver_id = ?)
      ORDER BY message.id ASC;
    `
    const [result] = await connection.execute(statement, [user1Id, user2Id, user2Id, user1Id]);
    return result;
  }
}

module.exports = new MessageService();