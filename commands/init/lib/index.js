'use strict';

const Command = require('@imoom-cli-dev/command');
const log = require('@imoom-cli-dev/log');

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || '';
    this.force = !!this._cmd.force;
    log.verbose('projectName', this.projectName);
    log.verbose('force', this.force);
  }
}

function init(argv) {
  // console.log('init', projectName, cmdObj.force,process.env.CLI_TARGET_PATH);
  return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;
