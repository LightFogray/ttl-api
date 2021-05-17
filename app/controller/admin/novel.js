'use strict';

const Controller = require('egg').Controller;

class NovelController extends Controller {
  async list() {
    const { ctx,app } = this;
    const { pageSize,curPage } = ctx.request.query;
    const keyword = ctx.request.query.keyword || "";
    const keytag = ctx.request.query.keytag || "";
    console.log(pageSize,curPage)
    const [res, meta] = await ctx.model.query(`SELECT
    novel.n_id,
		wxuser.wx_penname,
    novel.n_name,
    novel.n_intro,
    novel.n_cover_img,
    novel.status,
    GROUP_CONCAT(tag.t_name) tags
  FROM
    novel
		LEFT JOIN wxuser ON novel.u_id=wxuser.openid
    LEFT JOIN tag ON FIND_IN_SET( tag.id, novel.n_tags ) 
  WHERE
    novel.n_id IN ( SELECT n_id FROM novel )
    GROUP BY novel.n_id
  HAVING novel.n_name like '%${keyword}%' 
  AND tags LIKE '%${keytag}%'
    limit ${(curPage-1) * pageSize},${pageSize}`);
    let data = res.map(function(item) {
      if (item.tags != null) {
        item.tags = item.tags.split(',');
      }
      return item;
    })
    const [total, meta2] = await ctx.model.query('select count(0) total from novel')
    ctx.body = {
      data:data,
      total: total
    };
  }
  async billboard() {
    const { ctx,app } = this;
    const [list,meta] = await ctx.model.query(`SELECT
      n_name name,
      n_likes_num value 
    FROM
      novel 
    ORDER BY
      n_likes_num desc
      LIMIT 10`);
    ctx.body = list
  }
  async sublist() {
    const { ctx,app } = this;
    const { pageSize,curPage,nid } = ctx.request.query;
    const [res, meta] = await ctx.model.query(`SELECT
        nc.nc_id,
        nc.nc_number,
        nc.nc_title,
        nc.n_id,
        nc.created_at,
        nc.status
    FROM
      novel_chapter nc
    WHERE
      n_id = ${nid}
    ORDER BY
      nc_number 
    limit ${(curPage-1) * pageSize},${pageSize}`);
    const [total, meta2] = await ctx.model.query(`select count(0) total from novel_chapter where n_id=${nid}`)
    let data = res.map(function(item){
      item.created_at = JSON.stringify(item.created_at).split('.')[0].replace("T"," ").replace("\"","");
      return item;
    })
    ctx.body = {
      data:data,
      total: total
    };
  }
  async getChapterById() {
    const { ctx,app } = this;
    const { ncid } = ctx.params;
    const [res, meta] = await ctx.model.query(`
      select nc_content from novel_chapter where nc_id=${ncid}
    `);
    ctx.body = res;
  }
  async statisticByTag() {
    const { ctx,app } = this;
    const [list,meta] = await ctx.model.query(`SELECT
      count(novel.n_id) value,
      tag.t_name name
    FROM
      novel
      LEFT JOIN tag ON FIND_IN_SET( tag.id, novel.n_tags ) 
    WHERE
      novel.n_id IN ( SELECT n_id FROM novel )
    GROUP BY tag.id
    ORDER BY value desc
    LIMIT 5`);

    ctx.body = list
  }
  async updateStatus() {
    const {n_id,status} = this.ctx.request.body;
    const res = await this.ctx.model.Novel.update({
      status:status
    },{
      where:{
        nId : n_id
      }
    })
    this.ctx.body = 'success';
  }
  async updateChapterStatus() {
    const {nc_id,status} = this.ctx.request.body;
    const res = await this.ctx.model.query(`
      update novel_chapter set status=${status} where nc_id=${nc_id}
    `);
    this.ctx.body = 'success';

  }
}

module.exports = NovelController;
