'use strict';

module.exports = core;

//! require 支持加载.js/.json/.node
//! .js => module.exports/exports
//! .json => JSON.parse
//! .node => C++ Add
//! any => 其他类型文件全部默认通过.js的加载引擎进行加载
const path = require('path');
const semver = require('semver'); // 版本对比插件
const colors = require('colors'); // 输出颜色增强
const userHome = require('user-home'); // 获取用户主目录
const pathExists = require('path-exists').sync; // 检查路径是否存在
const log = require('@imook-cli-dev/log'); // 日志

const constant = require('./const');
const pkg = require('../package.json');
let args;
async function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkInputArgs();
    checkEnv();
    await checkGlobalUpdate();
  } catch (error) {
    log.error(error.message);
  }
}

// 检查是否需要全局更新
async function checkGlobalUpdate() {
  // 1、获取当前版本号和模块名
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // 2、调用npm API,获取所有版本号
  const { getNpmSemverVersion } = require('@imook-cli-dev/get-npm-info');
  const lastVersions = await getNpmSemverVersion(npmName);
  if (lastVersions && semver.gte(lastVersions, currentVersion)) {
    log.warn(
      colors.yellow(
        `请手动更新${npmName}，当前版本：${currentVersion},最新版本：${lastVersions} 更新命令：npm install -g ${npmName}`
      )
    );
  }

  // 3、提取所有版本号、对比那些版本号大于当前版本号的
  // 4、获取最新版本号提醒用户更新版本号
}

// 检查环境变量
function checkEnv() {
  const dotenv = require('dotenv');
  const dotenvPath = path.resolve(userHome, '.env');
  if (pathExists(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    });
  }
  createDefaultConfig();
  log.verbose('环境变量', process.env.CLI_HOME_PATH);
}
// 设置环境变量
function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
  return cliConfig;
}

// 检查入参是为了debug
function checkInputArgs() {
  const minimist = require('minimist'); //参数解析
  args = minimist(process.argv.slice(2));
  checkArgs();
}

// 切换log的日志打印级别
function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose';
  } else {
    process.env.LOG_LEVEL = 'info';
  }
  log.level = process.env.LOG_LEVEL;
}

// 检查主目录
function checkUserHome() {
  console.log('userHome:', userHome);
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red(`当前登录用户主目录不存在`));
  }
}

// 检查root启动
function checkRoot() {
  const rootCheck = require('root-check');
  rootCheck();
}

// 检查Node版本号
function checkNodeVersion() {
  // 第一步获取当前版本号
  const currentVersion = process.version;
  const lowestVersion = constant.LOWEST_NODE_VERSION;

  // 对比版本号
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(
      colors.red(`imook-cli 需要安装v${lowestVersion}以上版本的 Node.JS`)
    );
  }
}

// 检查版本号
function checkPkgVersion() {
  log.notice('cli', pkg.version);
}
