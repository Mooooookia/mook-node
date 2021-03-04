const Router = require('koa-router');
const {
  sendMessage,
  getMessageInfo,
  getMessageList,
  getMessageRecord
} = require('../controller/message.controller')
const {
  verifyToken,
  verifyMessage
} = require('../middleware/auth.middleware')

const messageRouter = new Router({
  prefix: '/message'
})

messageRouter.post('/', verifyToken, sendMessage)
messageRouter.get('/list', verifyToken, getMessageList)
messageRouter.get('/record', verifyToken, getMessageRecord)
messageRouter.get('/:messageId', verifyToken, verifyMessage, getMessageInfo)


module.exports = messageRouter;