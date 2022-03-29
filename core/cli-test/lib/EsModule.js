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
import utils from './utils';
utils()

// function index() {
//     console.log("Es-Module 模块功能介绍")
// }
