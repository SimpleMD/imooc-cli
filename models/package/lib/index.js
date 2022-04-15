'use strict';

const pkgDir = require('pkg-dir').sync;
const path = require('path');
const npminstall = require('npminstall');
const { isObject } = require('@imoom-cli-dev/utils');
const formatPath = require('@imoom-cli-dev/format-path')

class Package {
  constructor(options) {
    if (!options) {
      throw new Error('Package类的options参数不能为空！');
    }
    if (!isObject(options)) {
      throw new Error('Package类的options参必须为Object！');
    }
    console.log('Package constructor');
    // package的路径
    this.targetPath = options.targetPath;
    // package的Name
    this.packageName = options.packageName;
    // package的version
    this.packageVersion = options.packageVersion;
  }

  //判断当前Package是否存在
  exists() {}

  // 安装Package
  install() {
    
  }

  // 更新Package
  update() {}

  // 获取入口文件的路径
  getRootFilePath() {
    //todo 1. 获取package.json 所在的目录 - pag-dir
    const dir = pkgDir(this.targetPath);
    if (dir) {
      //todo 2. 读取package.json - require() js/json/node
      const pkgFile = require(path.resolve(dir, 'package.json'));
      //todo 3. 输出路径main/lib - path
      if (pkgFile && pkgFile.main) {
        //todo 3. 路径兼容（macOS/windows）
        return formatPath(path.resolve(dir, pkgFile.main));
      }
    }
    return null;
  }
}

module.exports = Package;
