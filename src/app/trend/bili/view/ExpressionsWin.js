Ext.define('Tool.trend.bili.view.ExpressionsWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_expressions-win',
    id: 'trend-bili_expressions-win',
    requires: [],
    initComponent: function () {
        let me = this;
        me.title = '<div align="center">参考公式</div>';
        me.resizable = false;
        me.modal = true;
        me.maximizable = false;
        me.closable = false;
        me.maximized = false;
        me.width = 300;
        me.height = 400;
        me.layout = 'fit';
        me.items = {
            xtype: 'form',
            layout: 'fit',
            enableTabScroll: true,//当Tab标签过多时,出现滚动条
            defaults: {autoScroll: true},
            buttons: [
                {
                    text: '保存',
                    doAction: 'doSaveExpressions',
                }
            ],
            items: {
                fieldLabel: '',
                labelWidth: 0,
                labelAlign: 'top',
                name: 'expressions',
                xtype: 'textarea',
                editable: true,
            }
        };


        me.callParent(arguments);
    }
});
