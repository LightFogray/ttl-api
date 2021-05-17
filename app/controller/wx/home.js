const { Controller } = require("egg");

class HomeContrller extends Controller{
  async getCode() {
    const {ctx,app} = this;
    const {code} = ctx.params;
    let appid = "wx5145b816a3b14cd2";
    let secret = "66efefcff9635b186103eeff7370b10f";
    let data = await ctx.curl(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,{
      dataType:'json'
    })
    // console.log(data)
    ctx.body = data;
  }
  async login() {
    const {ctx,app} = this;
    const {username,open_id,avatar_url} = ctx.request.body;
    console.log(username,open_id,avatar_url)
    const res = await ctx.model.Wxuser.findOne({
      where:{
        openid: open_id
      }
    })
    // console.log(res)
    let status = 0;
    if (res == null) {
      const result = await ctx.model.Wxuser.create({
        wxName:username,
        openid:open_id,
        wxAvatarUrl:avatar_url
      })
      if (result) {
        ctx.body = 1;
      }else{
        ctx.body = 0;
      }
    }else{
      ctx.body = 1;
    }
    
  }
  async getInfo() {
    const {ctx,app} = this;
    const {open_id} = ctx.params;
    const res = await ctx.model.Wxuser.findOne({
      where:{
        openid:open_id
      }
    })
    ctx.body = res;
  }
};

module.exports = HomeContrller;