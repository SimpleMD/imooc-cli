# Imook-cli 脚手架

## 开发记录
1. 当前执行流程 架构设计
imoomc-cli-dev => 脚手架启动阶段 => commander脚手架初始化 => 动态加载initCommand => new initCommander => init业务逻辑

[脚手架启动阶段] => 检察版本号 => 检察root启动 => 检察用户主目录 => 检察环境变量 => 检察cli最新版本

[new initCommander] => command constructor => 命令准备阶段 => 命令执行阶段
-- [命令准备阶段] => 检察Node版本 => 参数初始化


### 2022-04-11 =>  开始第四周开发
1. 图解高性能脚手架架构设计方法
2. 封装通用的Package和Command类
3. 基于缓存+Node多进程实现动态命令加载和执行
4. 将业务逻辑和脚手架彻底理解
5. Node多进程实现原理