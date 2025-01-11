# @vben/turbo-run

turbo-run is a command line tool that allows you to run multiple commands in parallel.

提供 `turbo-run` 命令：`turbo-run [目标命令]` `turbo-run dev`

- 获取大仓项目所有的包，并过滤出包含`目标命令`的包，并将所有包放入`@clack/prompts`提供的`select`组件提供给用户选择，选择后运行其对应的命令
