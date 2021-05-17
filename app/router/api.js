//外部接口路由
module.exports = app => {
  const { router, controller } = app;
  router.get('/api/wx/:code',controller.wx.home.getCode);
};