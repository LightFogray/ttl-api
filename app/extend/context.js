module.exports = {
  success(data = '', msg = 'ok', code = 200) {
      this.body = { code, msg, data };
  },
  fail(data = '', msg = 'fail', code = 400) {
      this.body = {code, msg, data };
  },
  /**生成不重复的字符串 */
  genString(){
      return new Date().getTime() + Math.floor(Math.random()*20);
  }
};