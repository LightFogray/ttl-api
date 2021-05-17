'use strict';

const Controller = require('egg').Controller;

class NoticeController extends Controller {
  async add() {
    const { ctx,app } = this;
    const {title,content,from,target} = ctx.request.body;
    console.log(title,content,from,target);
    const [res, meta] = await ctx.model.query(`
    insert into notice (title,content,from_a_id,to_u_id) values
     ('${title}','${content}','${from}','${target}')
    `);
    ctx.body = 1;
  }
  async delete() {
    const { ctx,app } = this;
    const { nid } = ctx.request.query;
    console.log(nid)
    const [res, meta] = await ctx.model.query(`
      delete from notice where id = ${nid}
    `);
    ctx.body = 1;
  }
  async list() {
    const { ctx,app } = this;
    const { pageSize,curPage } = ctx.request.query;
    const [res, meta] = await ctx.model.query(`SELECT
    notice.*,
    wxuser.wx_name 
  FROM
    notice
    LEFT JOIN wxuser ON notice.to_u_id = wxuser.openid
    limit ${(curPage-1) * pageSize},${pageSize}`);
    const [total, meta2] = await ctx.model.query('select count(0) total from notice')
    
    let data = res.map(function(item){
      item.created_at = JSON.stringify(item.created_at).split('.')[0].replace("T"," ").replace("\"","");
      return item;
    })
    ctx.body = {
      data:res,
      total: total
    };
  }
}

module.exports = NoticeController;
