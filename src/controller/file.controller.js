const fs = require("fs");

const fileService = require("../service/file.service");
const { SuccessModel } = require("../model/index");
const { PICTURE_PATH } = require("../constants/file-path");

class FileController {
  async saveAvatar(ctx, next) {
    const { filename, mimetype, size } = ctx.req.file;
    const { id } = ctx.user;

    const result = await fileService.createAvatar(filename, mimetype, size, id);

    ctx.body = new SuccessModel();
  }
  async savePicture(ctx, next) {
    const files = ctx.req.files;
    const { id } = ctx.user;
    const { articleId } = ctx.query;
    const filenameList = []
    for (let file of files) {
      const { filename, mimetype, size } = file;
      await fileService.createPicture(filename, mimetype, size, articleId, id);
      filenameList.push(filename)
    }
    ctx.body = new SuccessModel(filenameList);
  }
  async getPicture(ctx, next) {
    let { filename } = ctx.params;
    const file = await fileService.getPictureByFilename(filename);
    const { type } = ctx.query;
    const types = ["small", "middle", "large"];
    if (types.some((item) => item === type)) {
      filename += "-" + type;
    }

    ctx.response.set("content-type", file.mimetype);
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
  }
}

module.exports = new FileController();
