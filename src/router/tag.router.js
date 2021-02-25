const Router = require('koa-router');
const {
  getTag,
  addWatch,
  deleteWatch
} = require('../controller/tag.controller')

const {
  verifyToken
} = require('../middleware/auth.middleware')
const tagRouter = new Router({
  prefix: '/tag'
})
tagRouter.get('/', getTag)
tagRouter.post('/watch', verifyToken, addWatch);
tagRouter.delete('/watch', verifyToken, deleteWatch);

module.exports = tagRouter;
