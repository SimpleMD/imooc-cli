'use strict';

const cp = require('child_process');
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
    try {
      // 在当前模块使用
      // require(rootFile).call(null, Array.from(arguments)); // 直接执行文件方法
      // 在Node子进程中调用
      const args = Array.from(arguments);
      const cmd = args[args.length - 1];
      const o = Object.create(null);

      Object.keys(cmd).forEach((key) => {
        if (cmd.hasOwnProperty(key) && !key.startsWith('_') && key !== 'parent') {
          o[key] = cmd[key];
        }
      });
      args[args.length - 1] = o;
      const code = `require('${rootFile}').call(null, ${JSON.stringify(args)})`;
      const child = spawn('node', ['-e', code], {
        cwd: process.cwd(),
        stdio: 'inherit',
      });
      child.on('error', (e) => {
        log.error(e.message);
        process.exit(1);
      });
      child.on('exit', (e) => {
        log.verbose('命令执行成功：' + e);
      });
    } catch (error) {
      log.error(e.message);
    }
  }
}

// 兼容win和mac
function spawn(command, args, options) {
  const win32 = process.platform === 'win32';
  const cmd = win32 ? 'cmd' : command;
  const cmdArgs = win32 ? ['/c'].concat(command, args) : args;
  return cp.spawn(cmd, cmdArgs, options || {});
}

module.exports = exec;
