console.log("fork")
console.log('child pid', process.pid);

process.on('message',(msg) => {
  console.log(msg);
})