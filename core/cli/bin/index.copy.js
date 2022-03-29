#! /usr/bin/env node

const yargs = require('yargs/yargs');
const utils = require('@imook-cli-dev/utils');
// console.log('hello imooc-cli');

const { hideBin } = require('yargs/helpers');
const dedent = require('dedent');
const { boolean, pkgConf } = require('yargs');
const pkg = require('../package.json');
const cli = yargs();
// console.log('h', arg);
// recommendCommands
const argv = process.argv.slice(2);
const context = {
  imoocVersion: pkg.version,
};

cli
  .usage('Usage:imooc-cli-dev [command] <options>') //打印在第一行
  .demandCommand(1, '请最少输入的参数')
  .strict() //输入的命令没有匹配时的提示
  .recommendCommands() //命令写错提示
  .fail((err, msg) => {
    console.log('err', err);
    console.log('msg', msg);
  })
  .alias('h', 'help') // 匹配别名
  .alias('v', 'version')
  .wrap(cli.terminalWidth()) // 设置脚手架的宽度
  .epilogue(dedent`  111`)
  .options({
    debug: {
      type: boolean,
      describe: 'Bootstrap debug mode',
      alias: 'd',
    },
  })
  .option('registry', {
    type: boolean,
    describe: 'Define global',
    alias: 'r',
  })
  .group(['debug'], 'Dev Options:')
  .group(['registry'], 'Extra Options:')
  .command(
    'init [name]',
    'Do init a project',
    (yargs) => {
      yargs.option('name', {
        type: 'string',
        describe: 'Name of a project',
        alias: 'n',
      });
    },
    (argv) => {
      console.log(argv);
    }
  )
  .command({
    command: 'list',
    aliases: ['ls', 'la', 'll'],
    describe: 'List local packages',
    builder: (yargs) => {},
    handler: (argv) => {
      // Promise 是同步执行的
      console.log('argv:', argv);
      console.log('statr');
      setTimeout(() => {
        console.log("setTimeout")
      })
      new Promise(() => {
        let chain = Promise.resolve();
        chain.then(() => console.log("chain1"))
        chain.then(() => console.log("chain2"))
        chain.then(() => console.log("chain3"))
      })
      let chain = Promise.resolve();
      chain.then(() => console.log("chain4"))
      setTimeout(() => {
        let chain = Promise.resolve();
        chain.then(() => console.log("chain5"))
      })
      console.log("end")

      // console.log(/(?:)
    },
  })
  .parse(argv, context);
