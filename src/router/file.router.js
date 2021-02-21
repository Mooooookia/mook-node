const Router = require('koa-router');
const {
  verifyToken
} = require('../middleware/auth.middleware')
const {
  avatarHandler,
  pictureHandler,
  pictureResize
} = require('../middleware/file.middleware')
const {
  saveAvatar,
  savePicture,
  getPicture
} = require('../controller/file.controller')

const fileRouter = new Router({
  prefix: '/upload'
});

fileRouter.post('/avatar', verifyToken, avatarHandler, saveAvatar)
fileRouter.post('/picture', verifyToken, pictureHandler, pictureResize, savePicture)
fileRouter.get('/picture/:filename', getPicture);

module.exports = fileRouter;