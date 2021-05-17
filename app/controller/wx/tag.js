const { Controller } = require("egg");

class TagController extends Controller {

  async list() {
    const {ctx,app} = this;
    const list = await ctx.model.Tag.findAll();
    let arr = list.map(function(item){
      return item.tName;
    })
    ctx.body = arr;
  }

}
module.exports = TagController;