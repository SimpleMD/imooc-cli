const request = require('@imoom-cli-dev/request');

module.exports = function(){
  return request({
    url:'/project/template'
  })
}