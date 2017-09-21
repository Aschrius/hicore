Ext.define('Tool.base.view.ShellView', {
    extend: 'Ext.window.Window',
    alias: 'widget.shellview',
    initComponent: function() {
        var me = this;
        me.title = '<div align="center">shell</div>';
        me.resizable = false;
        me.modal = true;
        me.maximizable = false;
        me.closable = false;
        me.maximized = true;
        me.layout = 'fit';
        me.items = {
            xtype: 'form',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'textarea',
                defaults: {
                    padding: 0
                },
                flex: 1,
                editable: false,
                readOnly: true,
                action: 'task'
            }, {
                    xtype: 'tabpanel',
                    hidden: true,
                    flex: 1,
                    activeTab: 0,//初始显示第几个Tab页
                    deferredRender: false,//是否在显示每个标签的时候再渲染标签中的内容.默认true
                    tabPosition: 'top',//表示TabPanel头显示的位置,只有两个值top和bottom.默认是top.
                    enableTabScroll: true,//当Tab标签过多时,出现滚动条
                    defaults: { autoScroll: true, xtype: 'textarea' },
                    items: []
                }],
            buttonAlign: 'center',
            buttons: [{
                text: '返回',
                action: 'back',
                handler: function() {
                    me.close();
                }
            }]
        };

        me.callParent(arguments);
    }
});
