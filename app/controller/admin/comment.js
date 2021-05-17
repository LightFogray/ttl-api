const { Controller } = require("egg");

class PostController extends Controller {

  //展示小说出现过的标签
  async list() {
    const {ctx,app} = this;
    const {pid,ptype} = ctx.request.query;
    const [res,meta] = await ctx.model.query(`SELECT
    comment.*,
    wxuser.wx_name,
    wxuser.wx_avatar_url
  FROM
    comment
    LEFT JOIN wxuser ON comment.u_id = openid
  where comment.c_type = ${ptype} and comment.c_src_id = ${pid}`);
    let data = res.map(function(item){
      item.created_at = JSON.stringify(item.created_at).split('.')[0].replace("T"," ").replace("\"","");
      return item;
    })
    ctx.body = data;
  }
  async delete() {
    const {cid} = this.ctx.params;
    const res = await this.ctx.model.query(`
      delete from comment where c_id=${cid}
    `);
    this.ctx.body = 'success'
  }

}
module.exports = PostController;