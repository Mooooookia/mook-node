const Router = require('koa-router')
const {
  register,
  login
} = require('../controller/user.controller');
const {
  verifyUser,
  encryptPassword,
  verifyLogin
} = require('../middleware/user.middleware')
const {
  verifyToken
} = require('../middleware/auth.middleware');



const userRouter = new Router({prefix: '/user'});
userRouter.post('/register', verifyUser, encryptPassword, register);
userRouter.post('/login', verifyLogin, login);
userRouter.post('/test', verifyToken);

module.exports = userRouter;