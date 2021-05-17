const Controller = require('egg').Controller;

const path = require('path')
const fs = require('fs')
const Pump = require('mz-modules/pump');

class RadioplayController extends Controller {

  async list() {
    const { ctx,app } = this;
    const { pageSize,curPage } = ctx.request.query;
    const keyword = ctx.request.query.keyword || "";
    console.log(pageSize,curPage)
    const [res, meta] = await ctx.model.query(`SELECT
      radio_play.r_id,
      radio_play.r_status,
      radio_play.r_cover_img,
      radio_play.r_name,
      radio_play.r_intro,
      GROUP_CONCAT( tag.t_name ) tags
    FROM
      radio_play
      LEFT JOIN tag ON FIND_IN_SET( tag.id, radio_play.r_tags ) 
    WHERE
      radio_play.r_id IN ( SELECT r_id FROM radio_play ) 
    GROUP BY
      radio_play.r_id
    HAVING radio_play.r_name like '%${keyword}%' 
    limit ${(curPage-1) * pageSize},${pageSize}`);
    let data = res.map(function(item) {
      if (item.tags != null) {
        item.tags = item.tags.split(',');
      }
      return item;
    })
    const [total, meta2] = await ctx.model.query('select count(0) total from radio_play')
    ctx.body = {
      data:data,
      total: total
    };
  }
  async sublist() {
    const { ctx,app } = this;
    const { pageSize,curPage,rid } = ctx.request.query;
    const [res, meta] = await ctx.model.query(`SELECT
      e_id,
      e_number,
      e_title,
      e_src,
      created_at 
    FROM
      radio_play_episode 
    WHERE
      r_id = ${rid} 
    ORDER BY
      e_number
    limit ${(curPage-1) * pageSize},${pageSize}`);
    const [total, meta2] = await ctx.model.query(`select count(0) total from radio_play_episode where r_id=${rid}`)
    let data = res.map(function(item){
      item.created_at = JSON.stringify(item.created_at).split('.')[0].replace("T"," ").replace("\"","");
      return item;
    })
    ctx.body = {
      data: data,
      total: total
    };
  }
  async findRnameByRid() {
    const { ctx,app } = this;
    const { rid } = ctx.params;
    const [res, meta] = await ctx.model.query(`SELECT
    r_name 
  FROM
    radio_play 
  WHERE
    r_id = ${rid}`);
    ctx.body = res;
  }
  async upload() {
    let stream = await this.ctx.getFileStream();
    // 防止上传空文件
    if (!stream.filename) {
        return;
    }
    // 文件名，实际项目中文件名要添加时间戳
    let filename = stream.filename.toLowerCase();
    let target = 'app/public/upload/audio/' + path.basename(filename)
    let writeStream = fs.createWriteStream(target);

    await Pump(stream, writeStream);
    // console.log(stream.fields)
    let rid = stream.fields.rid;
    let title = stream.fields.title;
    let num = stream.fields.num;
    let fileurl = 'http://127.0.0.1:7001/public/upload/audio/'+path.basename(filename);
    // 提交表单
    await this.ctx.model.query(`
    insert into radio_play_episode (e_title,e_number,e_src,r_id) values ('${title}','${num}','${fileurl}',${Number(rid)})
    `)
    this.ctx.body = {
      status:200,
      msg:'success'
    };
  }
  async uploadCover() {
    let stream = await this.ctx.getFileStream();
    // 防止上传空文件
    if (!stream.filename) {
        return;
    }
    // 完善：文件名添加时间戳
    let filename = stream.filename.toLowerCase();
    let target = 'app/public/upload/radio_cover/' + path.basename(filename)
    let writeStream = fs.createWriteStream(target);

    await Pump(stream, writeStream);
    let name = stream.fields.name;
    let intro = stream.fields.intro;
    let tag = stream.fields.tag;
    let fileurl = 'http://127.0.0.1:7001/public/upload/radio_cover/'+path.basename(filename);
    // 提交表单
    await this.ctx.model.query(`
    insert into radio_play (r_name,r_intro,r_tags,r_cover_img) values ('${name}','${intro}','${tag}','${fileurl}')
    `)
    this.ctx.body = {
      status:200,
      msg:'success'
    };
  }
  async updateStatus() {
    const {r_id,r_status} = this.ctx.request.body;
    const res = await this.ctx.model.query(`
      update radio_play set r_status=${r_status} where r_id=${r_id}
    `);
    this.ctx.body = 'success';
  }
  async update() {
    const {eid,title,num} = this.ctx.request.body;
    const res = await this.ctx.model.query(`
      update radio_play_episode set e_title='${title}',e_number='${num}' where e_id=${eid}
    `);
    this.ctx.body = 'success';
  }
  async delete() {
    const {eid} = this.ctx.params;
    const res = await this.ctx.model.query(`
      delete from radio_play_episode where e_id=${eid}
    `);
    this.ctx.body = 'success';
  }
}

module.exports = RadioplayController;