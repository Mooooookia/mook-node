const Router = require('koa-router')
const {
  register,
  login,
  getAvatar,
  userInfo,
  authorInfo,
  changeInfo,
  changePassword,
  addFollow,
  deleteFollow,
  following,
  follower,
  getUserList,
  addBlack,
  deleteBlack,
  getBlack,
  getAction,
  test
} = require('../controller/user.controller');
const {
  verifyUser,
  encryptPassword,
  verifyLogin,
  verifyNewPassword
} = require('../middleware/user.middleware')
const {
  verifyToken,
  getUserByToken
} = require('../middleware/auth.middleware');



const userRouter = new Router({prefix: '/user'});
userRouter.post('/register', verifyUser, encryptPassword, register);
userRouter.post('/login', verifyLogin, login);
userRouter.post('/test', verifyToken, test);
userRouter.get('/avatar/:userId', getAvatar)
userRouter.get('/info', verifyToken, userInfo);
userRouter.patch('/info', verifyToken, changeInfo);
userRouter.get('/author/:userId', getUserByToken, authorInfo);
userRouter.patch('/password', verifyToken, verifyNewPassword, encryptPassword, changePassword)
userRouter.post('/follow', verifyToken, addFollow);
userRouter.delete('/follow', verifyToken, deleteFollow);
userRouter.get('/following', getUserByToken, following);
userRouter.get('/follower', getUserByToken, follower);
userRouter.get('/list', getUserByToken, getUserList);
userRouter.post('/blacklist', verifyToken, addBlack);
userRouter.delete('/blacklist', verifyToken, deleteBlack);
userRouter.get('/blacklist', verifyToken, getBlack);
userRouter.get('/action', getAction);

module.exports = userRouter;