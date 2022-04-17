'use strict';

const path = require('path')
const Package = require('@imoom-cli-dev/package');
const log =  require('@imoom-cli-dev/log');

const SETTINGS = {
  init:'@imoom-cli-dev/init'
}

const CACHE_DIR = 'dependencies'

function exec() {
  let targetPath = process.env.CLI_TARGET_PATH
  const homePath = process.env.CLI_HOME_PATH
  let storeDir = '';
  log.verbose('targetPath:',targetPath);
  log.verbose('homePath:',homePath);
  
  // 拿到cmmander对象
  const cmdObj = arguments[arguments.length - 1];
  const cmdName = cmdObj.name() // 拿到命令名称
  const packageName = SETTINGS[cmdName] // 拿到包名
  const packageVersion = 'latest'

  if(!targetPath){
    // 生成缓存路径
    targetPath = path.resolve(homePath,CACHE_DIR); // 生成缓存路径
    storeDir = path.resolve(targetPath,'node_modules');

    log.verbose('targetPath:',targetPath);
    log.verbose('storeDir:',storeDir);
  }

  const pkg = new Package({
    targetPath,
    storeDir,
    packageName,
    packageVersion
  });
  console.log(pkg.getRootFilePath())
}

module.exports = exec;
