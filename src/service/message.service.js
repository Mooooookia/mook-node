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

  async getMessageList(idName, userId, offset, limit) {
    const statement = `
      SELECT message.id, message.content, message.createAt,
      JSON_OBJECT('id', s.id, 'username', s.username, 'nickname', s.nickname) sender,
      JSON_OBJECT('id', r.id, 'username', r.username, 'nickname', r.nickname) receiver
      FROM message
      LEFT JOIN user s ON message.sender_id = s.id
      LEFT JOIN user r ON message.receiver_id = r.id
      WHERE ${idName}_id = ?
      ORDER BY message.createAt DESC
      LIMIT ?, ?;
    `
    const [result] = await connection.execute(statement, [userId, offset, limit]);
    return result;
  }
}

module.exports = new MessageService();