const tagService = require('../service/tag.service')

const verifyTags = async (ctx, next) => {
  const {tags} = ctx.request.body;
  const newTags = [];
  for (let content of tags) {
    const result = await tagService.getTagByContent(content);
    let id = -1;
    if (!result.length) {
      const res = await tagService.addTag(content);
      id = res.insertId;
    } else {
      id = result[0].id;
    }
    newTags.push(id);
  }
  ctx.tags = newTags;
  await next();
}

module.exports = {
  verifyTags
}