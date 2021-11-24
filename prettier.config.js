// 偏向于代码风格
module.exports = {
  printWidth: 100, // 超出换行
  semi: true, // 使用分号, 默认true
  vueIndentScriptAndStyle: true, // vue脚本缩紧和样式
  singleQuote: true, // 使用单引号, 默认false(在jsx中配置无效, 默认都是双引号)
  trailingComma: 'all', // 拖尾逗号
  proseWrap: 'never', // 如果超过printWidth长度不想换行，添加此条
  htmlWhitespaceSensitivity: 'strict', // 空格换行的处理方式
  endOfLine: 'auto', // 行尾部空行
};
