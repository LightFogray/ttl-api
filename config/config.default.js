/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1619341134094_2964';

  // add your middleware config here
  config.middleware = [];
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    password:'xxxxxxx',
    port: 3306,
    database: 'tenderland',
    timezone:'+8:00',
    define: {
      freezeTableName: true,//取消数据表名复数
      timestamps:false,
      createdAt: 'created_at',
      underscored: true

    }
  };
  // config.multipart = {
  //   mode: 'file'
  // };
  // oss存储
  config.oss = {  
    client: {
      accessKeyId: 'xxxxxx',
      accessKeySecret: 'xxxxxx',
      bucket: 'xxxxxx',
      endpoint: 'oss-cn-beijing.aliyuncs.com',
      timeout: '60s',
    },
  };
  config.security = {
    // 关闭 csrf
    csrf: {
      enable: false,
    }
  };
  // 允许跨域的方法
  config.cors = {
    origin: '*',
    allowMethods: 'GET, PUT, POST, DELETE, PATCH'
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
