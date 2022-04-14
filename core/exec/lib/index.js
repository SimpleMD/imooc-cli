'use strict';

const Package = require('@imoom-cli-dev/package');

function exec() {
  const pkg = new Package();
  console.log(pkg)
  console.log('exec');
  console.log('exec:', process.env.CLI_TARGET_PATH);
  console.log('exec:', process.env.CLI_HOME_PATH);
}

module.exports = exec;
