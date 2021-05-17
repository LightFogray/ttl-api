module.exports = app => {
  const { router, controller } = app;
  router.post('/admin/login', controller.admin.admin.login);
  router.get('/admin/info/:id', controller.admin.admin.findNameById);
  router.get('/admin/user/list', controller.admin.user.list);
  router.get('/admin/user/nlist', controller.admin.user.nlist);
  router.post('/admin/user/knock',controller.admin.user.knock);
  router.post('/admin/user/unknock',controller.admin.user.unknock);

  router.get('/admin/novel/statistic',controller.admin.novel.statisticByTag);
  router.get('/admin/novel/billboard',controller.admin.novel.billboard);
  router.get('/admin/novel/list', controller.admin.novel.list);
  router.get('/admin/novel/chapters', controller.admin.novel.sublist);
  router.get('/admin/novel/chapters/:ncid', controller.admin.novel.getChapterById);
  router.post('/admin/novel/restatus', controller.admin.novel.updateStatus);
  router.post('/admin/novel/chapter/restatus', controller.admin.novel.updateChapterStatus);

  router.post('/admin/notice/add', controller.admin.notice.add);
  router.get('/admin/notice/list', controller.admin.notice.list);
  router.get('/admin/notice/remove', controller.admin.notice.delete);

  router.get('/admin/radioplay/list', controller.admin.radioplay.list);
  router.get('/admin/radioplay/episode', controller.admin.radioplay.sublist);
  router.get('/admin/radioplay/name/:rid', controller.admin.radioplay.findRnameByRid);
  router.post('/admin/radioplay/upload',controller.admin.radioplay.upload);
  router.post('/admin/radioplay/cover/upload',controller.admin.radioplay.uploadCover);
  router.post('/admin/radioplay/restatus',controller.admin.radioplay.updateStatus);
  router.post('/admin/radioplay/episode/update',controller.admin.radioplay.update);
  router.get('/admin/radioplay/episode/delete/:eid',controller.admin.radioplay.delete);

  router.get('/admin/video/list', controller.admin.video.list);
  router.post('/admin/video/restatus', controller.admin.video.updateStatus);
  
  router.get('/admin/tag/list', controller.admin.tag.list);
  router.get('/admin/tag/alllist', controller.admin.tag.alllist);
  router.post('/admin/tag/add', controller.admin.tag.add);
  router.post('/admin/tag/update', controller.admin.tag.update);
  router.get('/admin/tag/delete/:id', controller.admin.tag.delete);

  router.get('/admin/accusation/list', controller.admin.accusation.list);
  router.get('/admin/accusation/delete/:aid', controller.admin.accusation.delete);
  router.post('/admin/accusation/dispose', controller.admin.accusation.update);
  router.get('/admin/accusation/getTip', controller.admin.accusation.getTip);

  router.get('/admin/post/list', controller.admin.post.list);
  router.get('/admin/post/delete/:pid', controller.admin.post.delete);
  router.post('/admin/post/add', controller.admin.post.add);

  router.get('/admin/comment/list', controller.admin.comment.list);
  router.get('/admin/comment/delete/:cid', controller.admin.comment.delete);
}; 