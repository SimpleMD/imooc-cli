'use strict';

const path = require('path');

module.exports = function formatPath(p) {
  if (p && typeof p == 'string') {
    const sep = path.sep; // 处理macOS和windows 斜杠的问题
    console.log('sep', sep);
    if (sep === '/') {
      return p;
    } else {
      return p.replace(/\\/g, '/');
    }
  }
  return p;
};
