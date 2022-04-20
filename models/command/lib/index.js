'use strict';

const semver = require('semver'); // 版本对比插件
const colors = require('colors'); // 输出颜色增强
const LOWEST_NODE_VERSION = '12.0.0';

class Command {
  constructor(argv) {
    console.log('Command constructor', argv);
    this._argv = argv;
    let runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.checkNodeVersion());
      chain.catch(err => { // 监听异常
        console.log(err.message);
      })
    });
  }

  // 检查Node版本号
  checkNodeVersion() {
    // 第一步获取当前版本号
    const currentVersion = process.version;
    const lowestVersion = LOWEST_NODE_VERSION;

    // 对比版本号
    if (!semver.gte(currentVersion, lowestVersion)) {
      throw new Error(colors.red(`imook-cli 需要安装v${lowestVersion}以上版本的 Node.JS`));
    }
  }
  init() {
    throw new Error('init必须实现');
  }
  exec() {
    throw new Error('exec必须实现');
  }
}

module.exports = Command;
