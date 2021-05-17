'use strict';
const moment = require('moment');
const Controller = require('egg').Controller;

class AccusationController extends Controller {
  async getTip() {
    const [total,meta] = await this.ctx.model.query(`
      select count(0) total from accusation where a_status = 0
    `);
    this.ctx.body = total;
  }
  async list() {
    const {ctx,app} = this;
    const { pageSize,curPage,status } = ctx.request.query;
    const [res,meta] = await ctx.model.query(`SELECT
      a_id,
      a_desc,
      a_img_url,
      u_id,
      a_status,
      wxuser.wx_name,
      a_dispose,
      disposed_at,
      accusation.created_at,
      accusation_type.type 
    FROM
      accusation
      LEFT JOIN wxuser ON u_id = wxuser.openid
      LEFT JOIN accusation_type ON a_type = accusation_type.id 
    WHERE a_status=${status}
    ORDER BY
      accusation.created_at
    limit ${(curPage-1) * pageSize},${pageSize}`);

    const [total, meta2] = await ctx.model.query('select count(0) total from accusation')
    let data = res.map(function(item){
      
      if (item.a_img_url != null) {
        item.a_img_url = item.a_img_url.split(',');
      }
      
      item.created_at = JSON.stringify(item.created_at).split('.')[0].replace("T"," ").replace("\"","");
      return item;
    })
    ctx.body = {
      data: data,
      total: total
    };
  }
  async update() {
    const {a_status, a_dispose,a_id} = this.ctx.request.body;
    let disposed_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    await this.ctx.model.query(`
      update accusation set a_status=${a_status}, a_dispose='${a_dispose}', disposed_at='${disposed_at}' where a_id=${a_id}
    `); 
    this.ctx.body = 'success'
  }

  async delete() {
    const {aid} = this.ctx.params;
    await this.ctx.model.query(`
      delete from accusation where a_id=${aid}
    `); 
    this.ctx.body = 'success'
  }
}

module.exports = AccusationController;
