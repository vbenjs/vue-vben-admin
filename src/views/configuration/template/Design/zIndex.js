export default (function () {
  class t {
    constructor() {
      this.name = 'zIndex'; // 重写的参数 key
    }
    css(t, e) {
      if (t && t.length) {
        if (e) return t.css('z-index', e);
      }
      return null;
    }
    createTarget() {
      return (
        (this.target = $(
          '<div class="hiprint-option-item">\n        <div class="hiprint-option-item-label">\n        元素层级2\n        </div>\n        <div class="hiprint-option-item-field">\n        <input type="number" class="auto-submit"/>\n        </div>\n    </div>',
        )),
        this.target
      );
    }
    getValue() {
      var t = this.target.find('input').val();
      if (t) return parseInt(t.toString());
    }
    setValue(t) {
      this.target.find('input').val(t);
    }
    destroy() {
      this.target.remove();
    }
  }
  return t;
})();
