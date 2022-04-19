'use strict';

const path = require('path');
const Package = require('@imoom-cli-dev/package');
const log = require('@imoom-cli-dev/log');

const SETTINGS = {
  init: '@imooc-cli/init',
};

const CACHE_DIR = 'dependencies';

async function exec() {
  let targetPath = process.env.CLI_TARGET_PATH;
  const homePath = process.env.CLI_HOME_PATH;
  let storeDir = '';
  let pkg;
  log.verbose('targetPath:', targetPath);
  log.verbose('homePath:', homePath);

  // 拿到cmmander对象
  const cmdObj = arguments[arguments.length - 1];
  const cmdName = cmdObj.name(); // 拿到命令名称
  const packageName = SETTINGS[cmdName]; // 拿到包名
  const packageVersion = 'latest';

  if (!targetPath) {
    // 生成缓存路径
    targetPath = path.resolve(homePath, CACHE_DIR); // 生成缓存路径
    storeDir = path.resolve(targetPath, 'node_modules');

    log.verbose('targetPath:', targetPath);
    log.verbose('storeDir:', storeDir);
    pkg = new Package({
      targetPath,
      storeDir,
      packageName,
      packageVersion,
    });

    if (await pkg.exists()) {
      //判断当前Package存在 就更新package
      await pkg.update();
    } else {
      //判断当前Package不存在 就安装package
      await pkg.install();
    }
  } else {
    // targetPath存在
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion,
    });
  }

  const rootFile = pkg.getRootFilePath(); // 获取入口文件
  log.verbose('rootFile:', rootFile);
  if (rootFile) {
    require(rootFile).apply(null, arguments); // 直接执行文件方法
  }
}

module.exports = exec;
