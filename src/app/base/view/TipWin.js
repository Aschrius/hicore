Ext.define('Tool.base.view.TipWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.tipwin',
    id: null,
    initComponent: function() {

        var me = this;

        time = me['delay'] || 2000;

        x = me['x'] || document.body.clientWidth;
        y = me['y'] || document.body.clientHeight;

        me.x = x - 210;
        me.y = y;

        me.baseCls = '';
        // 去除边框
        me.plain = true;
        me.header = false;
        me.border = false;
        me.closable = false;
        me.draggable = false;
        me.frame = false;
        me.resizable = false;
        me.width = 200;
        me.padding = 15;
        me.cls = 'af-tip';

        me.id = new Date().getTime();
        me.animate({
            duration: 100,
            to: {
                opacity: 50,
                y: y - 100
            }
        });

        me.callParent(arguments);

        var delayTask = new Ext.util.DelayedTask(function() {
            var win = Ext.ComponentQuery.query('tipwin[id=' + me.id + ']')[0];
            win.animate({
                duration: 200,
                to: {
                    opacity: 0
                }
            });
            var d = new Ext.util.DelayedTask(function() {
                win.close();
            });
            d.delay(100);

        });
        delayTask.delay(time);

    }
}); 