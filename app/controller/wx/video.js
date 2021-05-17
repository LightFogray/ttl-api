'use strict';

const Controller = require('egg').Controller;

class VideoController extends Controller {
  async findById() {
    const { ctx,app } = this;
    const { v_id } = ctx.params;
    const [res, meta] = await ctx.model.query(`SELECT
    video.*,
    wxuser.wx_name 
  FROM
    video
    LEFT JOIN wxuser ON video.u_id = wxuser.openid
  where v_id=${v_id}
  `);
    // let data = res.map(function(item){
    //   item.created_at = JSON.stringify(item.created_at).split('.')[0].replace("T"," ").replace("\"","");
    //   return item;
    // })
    ctx.body = res;
  }
  async list() {
    const { ctx,app } = this;
    const { pageSize,curPage } = ctx.request.query;
    const [res, meta] = await ctx.model.query(`SELECT
    video.*,
    wxuser.wx_name 
  FROM
    video
    LEFT JOIN wxuser ON video.u_id = wxuser.openid
  `);
    let data = res.map(function(item){
      item.created_at = JSON.stringify(item.created_at).split('.')[0].replace("T"," ").replace("\"","");
      return item;
    })
    const [total, meta2] = await ctx.model.query('select count(0) total from video')
    ctx.body = {
      data: data,
      total: total
    };
  }
}

module.exports = VideoController;
