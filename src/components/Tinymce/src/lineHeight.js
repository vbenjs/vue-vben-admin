const LineHeight = function (e) {
  e.PluginManager.add('lineheight', function (t, n, r) {
    t.on('init', function () {
      t.formatter.register({
        lineheight: {
          inline: 'span',
          styles: {
            'line-height': '%value',
          },
        },
      });
    });
    t.ui.registry.addMenuButton('lineheight', {
      icon: 'lineheight',
      tooltip: '设置行高',
      fetch: function (callback) {
        var dom = t.dom;
        var blocks = t.selection.getSelectedBlocks();
        var lhv = 0;
        global$1.each(blocks, function (block) {
          if (lhv == 0) {
            lhv = dom.getStyle(block, 'line-height') ? dom.getStyle(block, 'line-height') : 0;
          }
        });
        var items = lineheight_val.split(' ').map(function (item) {
          var text = item;
          var value = item;
          return {
            type: 'togglemenuitem',
            text: text,
            active: lhv == value ? true : false,
            onAction: function () {
              doAct(value);
            },
          };
        });
        callback(items);
      },
    });
  });
  e.PluginManager.requireLangPack('lineheight', 'de');
};

export default LineHeight;
