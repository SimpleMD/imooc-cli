#! /usr/bin/env node

const importLocal = require('import-local');

// 加载本地的文件
if (importLocal(__filename)) {
  require('npmlog').info('cli','正在使用 import-cli 本地版本')
} else {
  require('../lib')(process.argv.slice(2))
}
