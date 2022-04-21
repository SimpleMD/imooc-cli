'use strict';

const semver = require('semver'); // 版本对比插件
const colors = require('colors'); // 输出颜色增强
// const { isObject } = require('@imoom-cli-dev/utils');
const log = require('@imoom-cli-dev/log');

const LOWEST_NODE_VERSION = '12.0.0';

class Command {
  constructor(argv) {
    if (!argv) {
      new Error('参数不能为空！');
    }

    if (!Array.isArray(argv)) {
      new Error('参数必须为数组！');
    }

    if (argv.length < 1) {
      new Error('参数列表为空！');
    }
    this._argv = argv;
    let runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.checkNodeVersion());
      chain = chain.then(() => this.initArgv());
      chain = chain.then(() => this.init());
      chain = chain.then(() => this.exec());
      chain.catch((err) => {
        // 监听异常
        log.error(err.message);
      });
    });
  }

  // 初始化参数
  initArgv() {
    this._cmd = this._argv[this._argv.length - 1];
    this._argv = this._argv.slice(0, this._argv.length - 1);
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
