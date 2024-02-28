import { useMessage } from '@/hooks/web/useMessage';

const { createMessage: msg } = useMessage();

export default (function () {
  class t {
    constructor() {
      this.name = 'src';
    }
    createTarget(t) {
      this.el = t;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      const fileInput = `<input type="file" style="display:none">`;
      this.target = $(
        `<div class="hiprint-option-item hiprint-option-item-row">\n        <div class="hiprint-option-item-label">\n        图片地址\n        </div>\n        <div class="hiprint-option-item-field" style="display: flex;align-items: baseline;">\n     ${fileInput}   <input type="text" placeholder="请输入图片地址" class="auto-submit" style="width:70%">\n    <button class="hiprint-option-item-settingBtn" style="padding:0 10px;margin:0 0 0 5px" type="button">选择</button>        </div>\n    </div>`,
      );
      this.target.find('button').click(function () {
        that.target.find('input[type="file"]').click();
      });

      this.target.find('input[type="file"]').on('change', function (e) {
        const file = e?.target?.files?.[0];
        if (!file) return msg.error('请选择图片');
        if (file.type !== 'image/png' && file.type !== 'image/jpeg')
          return msg.error('图片格式不正确');
        if (file.size > 1024 * 100) return msg.error('图片大小不能超过100kb');

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          // e.target.result 即为base64结果
          that.setValue(e.target.result);
        };
      });

      return this.target;
    }
    getValue() {
      const t = this.target.find('input[type="text"]').val();
      if (t) return t.toString();
    }
    setValue(t) {
      this.target.find('input[type="text"]').val(t);
    }
    refresh(t, opt, cb) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      this.setValue(t), this.target.find('input[type="text"]').change();
      if (this.el && opt) {
        const img = new Image();
        img.src = t;
        if (img.complete) {
          that.updateEl(img.width, img.height, opt, cb);
        } else {
          img.onload = function () {
            that.updateEl(img.width, img.height, opt, cb);
          };
        }
      }
    }
    updateEl(width, height, opt, cb) {
      if (opt) {
        let ratio, w, h;
        if (opt || opt.auto) {
          if (width >= height) {
            opt.width = true;
          } else {
            opt.height = true;
          }
        }
        if (opt.width) {
          ratio = height / width;
          w = this.el.options.width;
          h = Math.floor(w * ratio * 10) / 10;
          this.el.options.height = h;
          this.el.designTarget.css('height', h + 'pt');
        } else if (opt.height) {
          ratio = width / height;
          h = this.el.options.height;
          w = Math.floor(h * ratio * 10) / 10;
          this.el.options.width = w;
          this.el.designTarget.css('width', w + 'pt');
        } else if (opt.real) {
          w = hinnn.px.toPt(width);
          h = hinnn.px.toPt(height);
          this.el.options.width = w;
          this.el.options.height = h;
          this.el.designTarget.css('width', w + 'pt');
          this.el.designTarget.css('height', h + 'pt');
        }
        this.el.designTarget.children('.resize-panel').trigger($.Event('click'));
      } else {
        cb && cb(this.el, width, height);
      }
    }
    destroy() {
      this.target.remove();
    }
  }

  return t;
})();
