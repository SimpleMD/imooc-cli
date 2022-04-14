'use strict';

class Package {
  constructor(options) {
    console.log('Package constructor');
    // package的路径
    this.targetPath = options.targetPath
    // package的缓存路径
    this.storePath = options.storePath
    // package的Name
    this.packageName = options.name
    // package的version
    this.packageVersion = options.version
  }

  //判断当前Package是否存在
  exists() {}

  // 安装Package
  install() {}

  // 更新Package
  update() {}

  // 获取入口文件的路径
  getRootFile() {}
}

module.exports = Package;
