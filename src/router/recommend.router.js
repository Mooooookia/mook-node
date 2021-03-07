const Router = require('koa-router')
const {
  verifyToken
} = require('../middleware/auth.middleware')
const {
  getRecommend
} = require('../controller/recommend.controller')

const RecommendRouter = new Router({
  prefix: '/recommend'
})

RecommendRouter.get('/article', verifyToken, getRecommend)


module.exports = RecommendRouter