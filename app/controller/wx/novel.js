const { Controller } = require("egg");
class NovelController extends Controller {
  async getNovelByTagName(){
    const {ctx,app} = this;
    const { tagName } = ctx.params;
    const [results, metadata] = await ctx.model.query(`SELECT
    tag_novel.nid,
    tag_novel.nname,
    tag_novel.nci,
    tag_novel.ni,
    tag_novel.nln,
    tag_novel.sts
  FROM
    (
    SELECT
      novel.n_name nname,
      novel.n_id nid,
      novel.n_cover_img nci,
      novel.n_intro ni,
      novel.n_likes_num nln,
      novel.status sts,
      tag.t_name 
    FROM
      novel
      LEFT JOIN tag ON FIND_IN_SET( tag.id, novel.n_tags ) 
    WHERE
      novel.n_id IN ( SELECT n_id FROM novel ) 
    ) tag_novel 
  WHERE
    tag_novel.t_name = '${tagName}' ORDER BY tag_novel.nln DESC;`);

    ctx.body = results;
  }
  async getNovelById() {
    const { ctx, app }  = this;
    const { id } = ctx.params;
    //以下写法有待研究
    // let novelModel = ctx.model.Novel;
    // let userModel = ctx.model.Wxuser;
    // novelModel.belongsTo(userModel, {
    //   foreginkey: "u_id",
    //   targetkey: "openid",
    // })
    // const res = await ctx.model.Novel.findOne({
    //   where:{
    //     nId: id
    //   },
    //   include: [{ model: userModel, attributes: ['wx_name'] }]
    // })
    const [res,meta] = await ctx.model.query(`SELECT
    novel.*,wxuser.wx_name
  FROM
    novel
    LEFT OUTER JOIN wxuser AS wxuser ON novel.u_id = wxuser.openid
  WHERE
    novel.n_id = ${id};`);
    ctx.body = res;
  }
  async searchByName() {
    const { ctx,app } = this;
    const { keyword } = ctx.params;
    const { Op } = app.Sequelize;
    const res = await ctx.model.Novel.findAll({
      where:{
        nName:{
          [Op.like]: '%'+keyword+'%'
        }
      }
    })

    ctx.body = res
  }
}
module.exports = NovelController;