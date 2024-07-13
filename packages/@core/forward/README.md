# @vben-core/forward

该目录内的包，可直接被app所引用，其是项目基础功能的一层抽象。允许轻微的副作用耦合，如`locales`的集成。

## 注意事项

- `forward` 内的包不允许相互引用，有相互引用的情况请考虑是否放到`packages/effects`下
