'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async list() {
    const { ctx,app } = this;
    const { pageSize,curPage } = ctx.request.query;
    const keyword = ctx.request.query.keyword || "";
    console.log(pageSize,curPage)
    const [res, meta] = await ctx.model.query(`SELECT
    wxuser.wx_name name,
    wxuser.openid openid,
    wxuser.publish_power power,
    wxuser.wx_avatar_url avatar,
    wxuser.wx_penname penname,
    GROUP_CONCAT( novel.n_id ) novels_id,
    GROUP_CONCAT( novel.n_name ) novels 
  FROM
    wxuser
    LEFT JOIN novel ON wxuser.openid = novel.u_id
  GROUP BY
    wxuser.openid
  HAVING wxuser.wx_name like '%${keyword}%' 
    limit ${(curPage-1) * pageSize},${pageSize}`);
    let data = res.map(function(item) {
      if (item.novels_id != null) {
        item.novels = item.novels.split(',');
        item.novels_id = item.novels_id.split(',');
      }
      return item;
    })
    const [total, meta2] = await ctx.model.query('select count(0) total from wxuser')
    ctx.body = {
      data:data,
      total: total
    };
  }
  async nlist(){
    const { ctx,app } = this;
    const [res, meta] = await ctx.model.query(`SELECT
      openid id,
      wx_name name
    FROM
      wxuser`);
    ctx.body = res
  }
  async knock() {
    const {ctx,app} = this;
    const { openid,reason } = ctx.request.body;
    let transaction = null
    try {
      transaction = await this.ctx.model.transaction();
      let res = await ctx.model.query(`UPDATE wxuser 
      SET publish_power = 1 
      WHERE
        openid = '${openid}'`, { transaction })
      await ctx.model.query(`insert into blacklist (u_id,reason) values ('${openid}','${reason}')`, { transaction })
      await transaction.commit();
      ctx.body = { code: 200, msg: 'success' }
    } catch (error) {
      await transaction.rollback();
      ctx.body = { code: 500, msg: 'err' }
    }
  }
  async unknock() {
    const {ctx,app} = this;
    const { openid } = ctx.request.body;
    let transaction = null
    try {
      transaction = await this.ctx.model.transaction();
      let [res,meta] = await ctx.model.query(`UPDATE wxuser 
        SET publish_power = 0 
        WHERE
          openid = '${openid}'`,{ transaction });
      await transaction.commit();
      ctx.body = { code: 200, msg: 'success' }
    } catch (error) {
      await transaction.rollback();
      ctx.body = { code: 500, msg: 'err' }
    }
  }
}

module.exports = UserController;
