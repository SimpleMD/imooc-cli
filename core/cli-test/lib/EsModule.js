'use strict';

//! 如何让Node支持Es Module
//! 模块化
//! CMD / AMD / require.js

//! CommonJS
//! 加载：require()
//! 输出：module.exports / exports.x

//! ES Module
//! 加载：import
//! 输出：export default / export function/const

// module.exports = index;
import path from 'path';
import { exists } from './utils';
// utils()
console.log("结果1",path.resolve('.'));
console.log("结果2",exists(path.resolve('.')))

(async function () {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('ok');
})();

// function index() {
//     console.log("Es-Module 模块功能介绍")
// }
