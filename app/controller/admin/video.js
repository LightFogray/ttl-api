'use strict';

const Controller = require('egg').Controller;

class VideoController extends Controller {
  async list() {
    const { ctx,app } = this;
    const { pageSize,curPage } = ctx.request.query;
    const keyword = ctx.request.query.keyword || "";
    console.log(pageSize,curPage)
    const [res, meta] = await ctx.model.query(`SELECT
    video.*,
    wxuser.wx_name 
  FROM
    video
    LEFT JOIN wxuser ON video.u_id = wxuser.openid
  WHERE video.v_title like '%${keyword}%' 
    limit ${(curPage-1) * pageSize},${pageSize}`);
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
  async updateStatus() {
    const {v_id,status} = this.ctx.request.body;
    const res = await this.ctx.model.query(`
      update video set status=${status} where v_id=${v_id}
    `);
    this.ctx.body = 'success';
  }
}

module.exports = VideoController;
