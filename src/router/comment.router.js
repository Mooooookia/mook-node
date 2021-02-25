const Router = require('koa-router');

const {
  addComment,
  deleteComment,
  getComment,
  addLike,
  deleteLike,
  reply,
} = require('../controller/comment.controller')
const {
  verifyToken,
  verifyPermission,
  getUserByToken
} = require('../middleware/auth.middleware');


const commentRouter = new Router({
  prefix: '/comment'
})

commentRouter.post('/like', verifyToken, addLike);
commentRouter.delete('/like', verifyToken, deleteLike);
commentRouter.post('/reply', verifyToken, reply)
commentRouter.post('/', verifyToken, addComment);
commentRouter.delete('/:commentId', verifyToken, verifyPermission, deleteComment);
commentRouter.get('/', getUserByToken, getComment)



module.exports = commentRouter;