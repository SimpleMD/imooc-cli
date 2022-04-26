'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const fse = require('fs-extra');
const Command = require('@imoom-cli-dev/command');
const log = require('@imoom-cli-dev/log');

const TYPE_PROJECT = 'project';
const TYPE_COMPONENT = 'component';
class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || '';
    this.force = !!this._cmd.force;
    log.verbose('projectName', this.projectName);
    log.verbose('force', this.force);
  }

  async exec() {
    try {
      // 1. 准备阶段
      await this.prepare();
      // 2. 下载模板
      // 3. 安装模板
    } catch (e) {
      log.error(e.message);
    }
  }

  async prepare() {
    // 1.判断当前目录是为空
    const localPath = process.cwd();
    if (!this.isDirEmpty(localPath)) {
      let ifContinue = false;
      if (!this.force) {
        // 询问是否继续创建
        ifContinue = (
          await inquirer.prompt({
            type: 'confirm',
            name: 'ifContinue',
            default: false,
            message: '当前文件夹不为空，是否继续创建项目？',
          })
        ).ifContinue;

        if (!ifContinue) {
          return;
        }
      }
      // 2. 强制更新
      if (ifContinue || this.force) {
        const { confirmDelete } = await inquirer.prompt({
          type: 'confirm',
          name: 'confirmDelete',
          default: false,
          message: '是否确认清空当前目录下得文件？',
        });
        if (confirmDelete) {
          fse.emptyDirSync(localPath);
        }
      }
    }
    return this.getProjectInfo();
  }

  async getProjectInfo() {
    // 3. 选择创建项目或组件
    // 4. 获取项目得基本信息
    let projectInfo = {};
    const { type } = await inquirer.prompt({
      type: 'list',
      name: 'type',
      message: '请选择初始化类型：',
      default: TYPE_PROJECT,
      choices: [
        {
          name: '项目',
          value: TYPE_PROJECT,
        },
        {
          name: '组件',
          value: TYPE_COMPONENT,
        },
      ],
    });

    if (type === TYPE_PROJECT) {
      const o = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: '请输入项目名称',
          default: '',
          validate: function (v) {
            return v;
          },
          filter: function (v) {
            return v;
          },
        },
        {
          type: 'input',
          name: 'projectVersion',
          message: '请输入项目版本号',
          default: '',
          validate: function (v) {
            return v;
          },
          filter: function (v) {
            return v;
          },
        },
      ]);
      console.log(o);
    } else if (type === TYPE_COMPONENT) {
    }

    return projectInfo;
  }

  // 判断文件夹是否为空
  isDirEmpty(localPath) {
    let fileList = fs.readdirSync(localPath);
    // 文件过滤
    fileList = fileList.filter((file) => !file.startsWith('.') && ['node_modules'].indexOf(file) < 0);
    return !fileList || fileList.length <= 0;
  }
}

function init(argv) {
  // console.log('init', projectName, cmdObj.force,process.env.CLI_TARGET_PATH);
  return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;
