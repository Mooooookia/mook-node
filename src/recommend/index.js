const recommendService = require('../service/recommend.service')




!(async function () {
  const userLikes = await recommendService.getUserLikeArticle();
  const N = {}
  const C = {}
  const userLikeArticle = {}
  for (const {userId, articles} of userLikes) {
    userLikeArticle[userId] = articles;
    for (const i of articles) {
      if (!N[i]) N[i] = 0;
      N[i] += 1;
      if (!C[i]) C[i] = {}
      for (const j of articles) {
        if (i == j) continue;
        if (!C[i][j]) C[i][j] = 0;
        C[i][j] += 1 / Math.log(1 + articles.length)
      }
    }
  }
  const W = {};
  for (let i in C) {
    if (!W[i]) W[i] = {}
    for (let j in C) {
      if (i == j) continue;
      if (!C[i][j]) C[i][j] = 0;
      W[i][j] = C[i][j] / Math.sqrt(N[i] * N[j])
    }
  }

  function getKSimilar(article, K) {
    if (!C[article]) return [];
    let articles = [...Object.keys(C[article])]
    articles = articles.sort((a, b) => C[article][b] - C[article][a]).slice(0, K)
    return articles.map(item => ({id: item, similarity: C[article][item]}));
  }

  console.log(getKSimilar(4, 10))

  const userInterestArticle = {}
  for (let article in C) {
    const similarArticles = getKSimilar(article, 10);
    const map = {}
    for (const item of similarArticles) {
      map[item.id] = item.similarity
    }
    for (let user in userLikeArticle) {
      if (userLikeArticle[user][article]) continue;
      if (!userInterestArticle[user]) userInterestArticle[user] = {}
      for (const item of userLikeArticle[user]) {
        if (!map[item]) continue;
        if (!userInterestArticle[user][article]) userInterestArticle[user][article] = 0;
        userInterestArticle[user][article] += map[item];
      }
    }
  }


  function recommendation(user, K) {
    if (!userInterestArticle[user]) return [];
    let articles = [...Object.keys(userInterestArticle[user])]
    articles = articles.sort((a, b) => userInterestArticle[user][b] - userInterestArticle[user][a]).slice(0, K);
    return articles
  }
  await recommendService.clearRecommend();
  for (let user in userInterestArticle) {
    const articles = recommendation(user, 10);
    for (const article of articles) {
      await recommendService.addRecommend(user, article)
    }
  }
})()
