const cp = require('child_process');

// console.log(cp);
// exec 执行命令行
cp.exec('ls -al', function(error, stdout, stderr){
  if(error) {
      console.error('error: ' + error);
      return;
  }
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + typeof stderr);
});