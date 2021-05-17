const { Controller } = require("egg");

class WxuserController extends Controller{
  async update(){
    const { ctx,app } = this;
    const { userInfo,openid } = ctx.request.body;
    // console.log(userInfo,openid);
    const res = await ctx.model.Wxuser.update({
      wxPenname: userInfo.wxPenname,
      device: userInfo.device,
      ipAddress:userInfo.ipAddress
    },{
      where:{
        openid:openid
      }
    })
  }
}
module.exports = WxuserController;