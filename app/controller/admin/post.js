const { Controller } = require("egg");
const path = require('path');
const fs = require('mz/fs');

class PostController extends Controller {

  //展示小说出现过的标签
  async list() {
    const {ctx,app} = this;
    const { pageSize,curPage } = ctx.request.query;
    const [res,meta] = await ctx.model.query(`SELECT
    post.*,
    wxuser.wx_name,
    wxuser.wx_avatar_url
  FROM
    post
    LEFT JOIN wxuser ON u_id = openid
  limit ${(curPage-1) * pageSize},${pageSize}`);
    
    const [total, meta2] = await ctx.model.query('select count(0) total from post')
    let data = res.map(function(item){
      
      if (item.p_img_url != null) {
        item.p_img_url = item.p_img_url.split(',');
      }
      
      item.created_at = JSON.stringify(item.created_at).split('.')[0].replace("T"," ").replace("\"","");
      return item;
    })
    ctx.body = {
      data: data,
      total: total
    };
  }
  async add() {
    const { ctx, app } = this;
    const file = ctx.request.files;
    const { u_id, content } = ctx.request.body;
    if (file == undefined) {
      //纯文字添加
      let result = await ctx.model.Post.create({
        uId:u_id,
        pContent:content
      });
      ctx.body = result
    } else if (file.length == 1) {
      const name = 'community/' + ctx.genString() + path.basename(file[0].filename);
      try {
        let result = await ctx.oss.put(name, file[0].filepath);
        let data = await ctx.model.Post.create({
          uId:u_id,
          pContent:content,
          pImgUrl:result.url
        });
        ctx.body = data;
      } finally {
        await fs.unlink(file[0].filepath);
      }
    } else if (file.length > 1) {
      var str = ""; //存储图片字符串路径
      for (let fileVal of file) {
        let name = 'community/' + ctx.genString() + path.basename(fileVal.filename);
        try {
            let result = await ctx.oss.put(name, fileVal.filepath);
            str = str + result.url + ",";
        } finally {
            await fs.unlink(fileVal.filepath);
        }
      }
      let data = await ctx.model.Post.create({
        uId:u_id,
        pContent:content,
        pImgUrl:str
      });
      ctx.body=data;
    }
  }
  async delete() {
    const {pid} = this.ctx.params;
    const res = await this.ctx.model.query(`
      delete from post where p_id=${pid}
    `);
    this.ctx.body = 'success'
  }
  

}
module.exports = PostController;