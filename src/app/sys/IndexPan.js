Ext.define('Tool.sys.IndexPan', {
    extend: 'Ext.panel.Panel',
    id: 'sys-index-pan',
    title: '系统',
    alias: 'widget.sys-index-pan',
    initComponent: function () {
        let data = AT.auth.uiData;
        ExtUtil.initIndexView(this, data, 3);

        this.callParent(arguments);
    }
});
