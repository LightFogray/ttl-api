const { Controller } = require("egg");

class TagController extends Controller {

  //展示小说出现过的标签
  async list() {
    const {ctx,app} = this;
    const [res,meta] = await ctx.model.query(`SELECT
      tag.t_name apr_tags 
    FROM
      novel
      LEFT JOIN tag ON FIND_IN_SET( tag.id, novel.n_tags ) 
    WHERE
      novel.n_id IN ( SELECT n_id FROM novel ) 
    GROUP BY
      tag.id`);
    
    let data = res.map(item=>item.apr_tags);
    ctx.body = data;
  }
  async alllist() {
    const { ctx,app } = this;
    let pageSize = ctx.request.query.pageSize || 0;
    let curPage = ctx.request.query.curPage || 1;
    const [total, meta2] = await ctx.model.query('select count(0) total from tag')
    pageSize = pageSize == 0 ? total[0].total : pageSize;
    console.log(pageSize,curPage)
    const [res, meta] = await ctx.model.query(`
    SELECT * from tag
    limit ${(curPage-1) * pageSize},${pageSize}`);
    
    ctx.body = {
      data: res,
      total: total
    };
  }
  async add() {
    const {t_name} = this.ctx.request.body;
    const res = await this.ctx.model.Tag.create({
      tName:t_name
    })

    this.ctx.body = 1;
  }
  async update() {
    const {id,t_name} = this.ctx.request.body;
    const res = await this.ctx.model.Tag.update({
      tName:t_name
    },{
      where:{
        id:id
      }
    })

    this.ctx.body = 1;
  }
  async delete() {
    const {id} = this.ctx.params;
    const res = await this.ctx.model.Tag.destroy({
      where:{
        id:id
      }
    })

    this.ctx.body = 1;
  }

}
module.exports = TagController;