const Router = require('koa-router')

const {
  getArticleList,
  addNewArticle,
  changeArticle,
  deleteArticle,
  getArticleInfo,
  addLike,
  deleteLike,
  getLike,
  addCollection,
  deleteCollection,
  getCollection
} = require('../controller/article.controller')
const {
  verifyToken,
  verifyPermission,
  getUserByToken
} = require('../middleware/auth.middleware')
const {
  verifyTags
} = require('../middleware/tag.middleware')

const articleRouter = new Router({
  prefix: '/article'
})
articleRouter.get('/list', getArticleList)
articleRouter.post('/', verifyToken, verifyTags, addNewArticle)
articleRouter.post('/like', verifyToken, addLike);
articleRouter.delete('/like', verifyToken, deleteLike);
articleRouter.get('/like', getLike)
articleRouter.post('/collection', verifyToken, addCollection);
articleRouter.delete('/collection', verifyToken, deleteCollection);
articleRouter.get('/collection', getCollection)

articleRouter.patch('/:articleId', verifyToken, verifyPermission, verifyTags, changeArticle)
articleRouter.delete('/:articleId', verifyToken, verifyPermission, deleteArticle)
articleRouter.get('/:id', getUserByToken, getArticleInfo);



module.exports = articleRouter;