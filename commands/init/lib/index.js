'use strict';

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const semver = require('semver');
const fse = require('fs-extra');
const userHome = require('user-home'); // 获取用户主目录
const Command = require('@imoom-cli-dev/command');
const Package = require('@imoom-cli-dev/package');
const log = require('@imoom-cli-dev/log');
const { spinnerStart,sleep } = require('@imoom-cli-dev/utils');

const getProjectTemplate = require('./getProjectTemplate');

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
      const projectInfo = await this.prepare();
      if (projectInfo) {
        // 2. 下载模板
        log.verbose('projectInfo:', projectInfo);
        this.projectInfo = projectInfo;
        await this.downloadTemplate();
        // 3. 安装模板
      }
    } catch (e) {
      log.error(e.message);
    }
  }

  async prepare() {
    // 0.判断是否有模板
    const template = await getProjectTemplate();
    if (!template || template.length === 0) {
      throw new Error('项目模板不存在');
    }
    this.template = template;

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
      const project = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: '请输入项目名称',
          default: '',
          validate: function (v) {
            const done = this.async();
            // 1.首字母必须为英文字母
            // 2.尾字符必须为英文或数字，不能为字符
            // 3.字符不允许为“-_”
            // return /^[a-zA-z]+[\w-]*[a-zA-z0-9]$/.test(v);
            setTimeout(function () {
              if (!/^[a-zA-z]+[\w-]*[a-zA-z0-9]$/.test(v)) {
                done('请输入合法得项目名称');
                return;
              }
              done(null, true);
            }, 0);
          },
          filter: function (v) {
            return v;
          },
        },
        {
          type: 'input',
          name: 'projectVersion',
          message: '请输入项目版本号',
          default: '1.0.0',
          validate: function (v) {
            const done = this.async();
            setTimeout(function () {
              if (!!!semver.valid(v)) {
                done('请输入合法得项目版本号');
                return;
              }
              done(null, true);
            }, 0);
          },
          filter: function (v) {
            if (!!semver.valid(v)) {
              return semver.valid(v);
            } else {
              return v;
            }
          },
        },
        {
          type: 'list',
          name: 'projectTemplate',
          message: '请选择项目模板',
          choices: this.createTemplateChoice(),
        },
      ]);
      projectInfo = {
        type,
        ...project,
      };
    } else if (type === TYPE_COMPONENT) {
    }

    return projectInfo;
  }

  // 下载项目模板
  async downloadTemplate() {
    // 获取到选择的模板信息
    const { projectTemplate } = this.projectInfo;
    // 根据选择赛选模板信息
    const templateInfo = this.template.find((item) => item.npmName === projectTemplate);
    const targetPath = path.resolve(userHome, '.imoom-cli-dev', 'template');
    const storeDir = path.resolve(userHome, '.imoom-cli-dev', 'template', 'node_modules');
    const { npmName, version } = templateInfo;
    const templateNpm = new Package({
      targetPath,
      storeDir,
      packageName: npmName,
      packageVersion: version,
    });
    console.log(targetPath, storeDir, npmName, version, templateNpm);
    // 如果包不存在的话
    if (!(await templateNpm.exists())) {
      const spinner = spinnerStart('正在下载模板...'); // 开启loading的状态
      await sleep();
      await templateNpm.install();
      spinner.stop(true);
      log.success('下载模板成功')
    } else {
      const spinner = spinnerStart('正在更新模板...'); // 开启loading的状态
      await sleep();
      await templateNpm.update();
      spinner.stop(true);
      log.success('更新模板成功')
    }
  }

  // 判断文件夹是否为空
  isDirEmpty(localPath) {
    let fileList = fs.readdirSync(localPath);
    // 文件过滤
    fileList = fileList.filter((file) => !file.startsWith('.') && ['node_modules'].indexOf(file) < 0);
    return !fileList || fileList.length <= 0;
  }

  createTemplateChoice() {
    return this.template.map((item) => ({
      value: item.npmName,
      name: item.name,
    }));
  }
}

function init(argv) {
  // console.log('init', projectName, cmdObj.force,process.env.CLI_TARGET_PATH);
  return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;
