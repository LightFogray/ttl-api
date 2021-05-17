module.exports = app => {
  const { router,controller } = app;
  router.post('/wx/login', controller.wx.home.login);
  router.get('/wx/getInfo/:open_id',controller.wx.home.getInfo);
  router.post('/wx/user/update', controller.wx.wxuser.update);
  router.get('/wx/tag/list', controller.wx.tag.list);
  router.get('/wx/novel/list/:tagName', controller.wx.novel.getNovelByTagName);//根据标签名获取包含该标签的所有小说
  router.get('/wx/novel/:id', controller.wx.novel.getNovelById);//根据id获取小说
  router.get('/wx/novel/search/:keyword', controller.wx.novel.searchByName);

  router.get('/wx/video/list', controller.wx.video.list);
  router.get('/wx/video/list/:v_id', controller.wx.video.findById);

}