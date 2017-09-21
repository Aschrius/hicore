Ext.define('Tool.base.view.MvcView', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.mvcview',
    initComponent: function () {

        let me = this;
        me.layout = 'fit';
        me.items = {
            tabPosition: 'top',
            xtype: 'tabpanel',
            tabBarPosition: 'bottom',
            modal: true,
            layout: 'fit',
            border: false,
            bodyBorder: false,
            style: {
                background: "#fff"
            },
            items: []
        };


        me.callParent(arguments);

    }
});
