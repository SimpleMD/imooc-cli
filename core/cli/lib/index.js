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
const commander = require('commander'); // 用于注册命令
const log = require('@imoom-cli-dev/log'); // 日志
const init = require('@imoom-cli-dev/init'); // 初始化命令
const exec = require('@imoom-cli-dev/exec'); // 初始化命令


const constant = require('./const');
const pkg = require('../package.json');
let args;

// 实例化commander
const program = new commander.Command();

async function core() {
  try {
    await prepare()
    registerCommand();
  } catch (error) {
    log.error("整体错误信息：", error.message);
    if(program.debug){
      console.log(e)
    }
  }
}

// 实例化commander命令注册
function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .option('-d, --debug', '是否开启调试', false)
    .option('-tp, --targetPath <targetPath>', '是否制定本地调试文件路径', '')
    .version(pkg.version);

  // 命令注册
  program.command('init [projectName]').option('-f, --force', '是否强制初始化项目').action(exec);

  // 监听debug模式
  program.on('option:debug', function () {
    if (program.debug) {
      process.env.LOG_LEVEL = 'verbose';
    } else {
      process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
  });

  // 制定targetPath
  program.on('option:targetPath', function () {
    process.env.CLI_TARGET_PATH = program.targetPath;
  });

  // 监听其他所有命令
  program.on('command:*', function (obj) {
    const availableCommands = program.commands.map((cmd) => cmd.name());
    console.log(colors.red('未知的命令：' + obj[0]));
    console.log(colors.red('可用的命令：' + availableCommands.join(',')));
  });

  program.parse(process.argv);

  // 当没有输入参数的时候打印帮助文档
  if (program.args && program.args.length < 1) {
    program.outputHelp();
    console.log();
  }
}

// 初始化之前
async function prepare() {
  checkPkgVersion();
  checkNodeVersion();
  checkRoot();
  checkUserHome();
  checkEnv();
  await checkGlobalUpdate();
}

// 检查是否需要全局更新
async function checkGlobalUpdate() {
  // 1、获取当前版本号和模块名
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // 2、调用npm API,获取所有版本号
  const { getNpmSemverVersion } = require('@imoom-cli-dev/get-npm-info');
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

// 检查主目录
function checkUserHome() {
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
    throw new Error(colors.red(`imook-cli 需要安装v${lowestVersion}以上版本的 Node.JS`));
  }
}

// 检查版本号
function checkPkgVersion() {
  log.notice('cli', pkg.version);
}
