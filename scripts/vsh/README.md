# @vben/vsh

shell 脚本工具集合

主要提供了以下命令

- lint
  - 用于检查代码的格式是否正确，相当于同时执行了：`stylelint` `eslint` `prettier`的代码风格检测
  - `--format` 参数：会自动修复代码
- publint
  - 用于检查项目中的包是否符合 `publint` 规则
  - `--check` 参数：仅检查错误，不退出程序
- code-workspace
  - 用于生成和更新 Visual Studio Code 的 .code-workspace 文件的工具
  - `--spaces` 参数：生成 `.code-workspace` 文件时指定缩进空格数 `默认: 2`
  - `--auto-commit`参数： 生成 `.code-workspace` 文件时自动将其添加到Git仓库
- check-circular
  - 检测项目中的所有循环依赖，并详细输出结果
  - `--staged`参数：仅检测暂存区中的文件是否存在循环依赖，并详细输出结果
- check-dep
  - 用于检测项目中的未使用依赖和未声明依赖
