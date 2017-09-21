Ext.define('Tool.sys.auth.view.ResPan', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sys-auth_res-pan',
    id: 'sys-auth_res-pan',
    title: '资源',
    initComponent: function () {
        let me = this;
        me.layout = 'fit';
        me.border = false;
        me.bodyBorder = false;
        me.items = [{
            xtype: 'treepanel',
            border: false,
            rootVisible: true,
            store: 'Tool.sys.auth.store.ResTreeStore',
            tbar: ["->", {
                iconCls: 'Reload',
                xtype: 'button',
                text: '重载',
                doAction: 'initTree'
            }]
        }];
        this.callParent();
    }
}); 