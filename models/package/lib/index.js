'use strict';

const pkgDir = require('pkg-dir').sync;
const path = require('path');
const npminstall = require('npminstall');
const pathExists = require('path-exists').sync;
const fse = require('fs-extra');
const { isObject } = require('@imoom-cli-dev/utils');
const { getDefaultRegistry, getNpmLatestVersion } = require('@imoom-cli-dev/get-npm-info');
const formatPath = require('@imoom-cli-dev/format-path');

class Package {
  constructor(options) {
    if (!options) {
      throw new Error('Package类的options参数不能为空！');
    }
    if (!isObject(options)) {
      throw new Error('Package类的options参必须为Object！');
    }
    // package的路径
    this.targetPath = options.targetPath;
    // package缓存路径
    this.storeDir = options.storeDir;
    // package的Name
    this.packageName = options.packageName;
    // package的version
    this.packageVersion = options.packageVersion;
    // package缓存目录前缀
    this.cacheFilePathPrefix = this.packageName.replace('/', '_');
  }

  async prepare() {
    if (this.storeDir && !pathExists(this.storeDir)) {
      fse.mkdirpSync(this.storeDir);
    }
    // 获取最新的npm版本
    if (this.packageVersion === 'latest') {
      this.packageVersion = await getNpmLatestVersion(this.packageName);
    }
  }

  // 拼接缓存路径
  get cacheFilePath() {
    return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`);
  }

  getSpecificCacheFilePath(packageVersion) {
    return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${packageVersion}@${this.packageName}`);
  }

  //判断当前Package是否存在
  async exists() {
    if (this.storeDir) {
      await this.prepare();
      return pathExists(this.cacheFilePath);
    } else {
      return pathExists(this.targetPath);
    }
  }

  // 安装Package
  async install() {
    await this.prepare();
    return npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [
        {
          name: this.packageName,
          version: this.packageVersion,
        },
      ],
    });
  }

  // 更新Package
  async update() {
    await this.prepare();
    // 1、获取最新的npm模块版本号
    const latestPackageVersion = await getNpmLatestVersion(this.packageName);
    // 2、查询最新版本号对应的路径是否存在
    const latestFilePath = this.getSpecificCacheFilePath(latestPackageVersion);
    // 3、如果不存在，则直接安装最新版本
    if (!pathExists(latestFilePath)) {
      await npminstall({
        root: this.targetPath,
        storeDir: this.storeDir,
        registry: getDefaultRegistry(),
        pkgs: [
          {
            name: this.packageName,
            version: latestPackageVersion,
          },
        ],
      });

      this.packageVersion = latestPackageVersion;
    }
  }

  // 获取入口文件的路径
  getRootFilePath() {
    function _getRootFile(targetPath) {
      //todo 1. 获取package.json 所在的目录 - pag-dir
      const dir = pkgDir(targetPath);
      if (dir) {
        //todo 2. 读取package.json - require() js/json/node
        const pkgFile = require(path.resolve(dir, 'package.json'));
        //todo 3. 输出路径main/lib - path
        if (pkgFile && pkgFile.main) {
          //todo 3. 路径兼容（macOS/windows）
          return formatPath(path.resolve(dir, pkgFile.main));
        }
      }
      return null;
    }
    if (this.storeDir) {
      // 使用缓存的情况
      return _getRootFile(this.cacheFilePath)
    } else {
      // 不适用缓存的情况
      return _getRootFile(this.targetPath)
    }
  }
}

module.exports = Package;
