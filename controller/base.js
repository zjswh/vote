delete require.cache[require.resolve('./base')]

module.exports = {
    constructor: async ()=>{},
    params: {},
    setParams: (params = {}) => {
      this.params = params
    },
    headers: {},
    setHeaders: (headers = {}) => {
      this.headers = headers
    },
    shortToken: '',
    userInfo: {},
    setUserInfo:  (userInfo = {}) => {
      this.userInfo = userInfo
    }
}