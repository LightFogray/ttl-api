'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
  async login() {
    const { ctx,app } = this;
    const {name,password} = ctx.request.body;
    console.log(name,password)
    const res = await ctx.model.Admin.findOne({
      where: {
        name: name,
        password: password
      }
    })
    ctx.body = res.id;
  }
  async findNameById() {
    const {id} = this.ctx.params;
    const res = await this.ctx.model.Admin.findOne({
      where:{
        id:id
      }
    })
    this.ctx.body = res.name;
  }
}

module.exports = AdminController;
