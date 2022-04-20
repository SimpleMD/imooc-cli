const cp = require('child_process');
const path = require('path');

// console.log(cp);
// exec 执行命令行shell脚本
// cp.exec('ls -al', function (error, stdout, stderr) {
//   if (error) {
//     console.error('error: ' + error);
//     return;
//   }
//   console.log('stdout: ' + stdout);
//   console.log('stderr: ' + typeof stderr);
// });

// console.log(path.resolve(__dirname, 'test.shell'))

// 执行脚本文件
// cp.execFile(path.resolve(__dirname, 'test.shell'), function (error, stdout, stderr) {
//   console.error('error: ' + error);
//   console.log('stdout: ' + stdout);
//   console.log('stderr: ' + typeof stderr);
// });
// const child = cp.spawn('npm.cmd', ['install'], {
//   cwd: 'E:/马登/My-Github/imooc-cli-dev/imooc-cli/core/cli',
// });

// child.stdout.on('data', function (chunk) {
//   console.log('stdout', chunk.toString());
// });

// child.stderr.on('data', function (chunk) {
//   console.log('stderr', chunk.toString());
// });

// spawn： 耗时任务 npm install
// exec/execFile: 开销较小的任务
// fork 会开启两个进程

const child = cp.fork(path.resolve(__dirname, 'child.js'));
child.send('hello child process!',() => {
  child.disconnect();
})
console.log('child pid', process.pid);
 