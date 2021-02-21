const Router = require('koa-router')
const {
  register,
  login,
  getAvatar,
  userInfo,
  authorInfo,
  changeInfo,
  changePassword
} = require('../controller/user.controller');
const {
  verifyUser,
  encryptPassword,
  verifyLogin,
  verifyNewPassword
} = require('../middleware/user.middleware')
const {
  verifyToken
} = require('../middleware/auth.middleware');



const userRouter = new Router({prefix: '/user'});
userRouter.post('/register', verifyUser, encryptPassword, register);
userRouter.post('/login', verifyLogin, login);
userRouter.post('/test', verifyToken);
userRouter.get('/avatar/:userId', getAvatar)
userRouter.get('/info', verifyToken, userInfo);
userRouter.patch('/info', verifyToken, changeInfo);
userRouter.get('/author/:userId', authorInfo);
userRouter.patch('/password', verifyToken, verifyNewPassword, encryptPassword, changePassword)

module.exports = userRouter;