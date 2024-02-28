export default (function () {
  class t {
    constructor() {
      this.name = 'fontSize'; // 重写的参数 key
    }
    css(t, e) {
      if (t && t.length) {
        if (e) return t.css('font-size', e + 'pt'), 'font-size:' + e + 'pt';
        t[0].style.fontSize = '';
      }
      return null;
    }
    createTarget() {
      const list = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
      let fontSizeList = '\n            <option value="" >默认</option>';
      list.forEach(function (e) {
        fontSizeList += '\n            <option value="' + e + '">' + e + 'pt</option>';
      });
      this.target = $(
        ' <div class="hiprint-option-item">\n        <div class="hiprint-option-item-label">\n        字体大小\n        </div>\n        <div class="hiprint-option-item-field">\n        <select class="auto-submit">        </select>\n        </div>\n    </div>',
      );
      this.target.find('.auto-submit').append($(fontSizeList));
      return this.target;
    }
    getValue() {
      const t = this.target.find('select').val();
      if (t) return parseFloat(t.toString());
    }
    setValue(t) {
      t &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find('select').prepend('<option value="' + t + '" >' + t + '</option>'));
      this.target.find('select').val(t);
    }
    destroy() {
      this.target.remove();
    }
  }
  return t;
})();
