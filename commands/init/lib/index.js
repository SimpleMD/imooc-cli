'use strict';

function init(projectName, cmdObj) {
  console.log('2222');
  console.log('init', projectName, cmdObj.force,process.env.CLI_TARGET_PATH);
}

module.exports = init;
