const ejs = require('ejs');
const path = require('path');

const html = '<div><%= user.name %></div>';
const options = {};
const data = {
  user: {
    name: 'sam',
    copyright:'Ma'
  },
};

// 第一种用法
// 返回funtion，用于解析html中得ejs
const template = ejs.compile(html, options);
const compileTemplate = template(data);

console.log(compileTemplate);

// 第二种用法
const renderedTemplate = ejs.render(html, data, options);
console.log(renderedTemplate);

// 第三种用法
const renderedFile = ejs.renderFile(path.resolve(__dirname, 'template.html'), data, options);
renderedFile.then(res => {
  console.log(res)
})
ejs.renderFile(path.resolve(__dirname, 'template.html'), data, options,(err,file) => {
  console.log(file)
});