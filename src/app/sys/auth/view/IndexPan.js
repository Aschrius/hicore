Ext.define('Tool.system.view.IndexPan', {
    extend: 'Ext.panel.Panel',
    id: 'systemindexpan',
    title: '主页',
    alias: 'widget.systemindexpan',
    initComponent: function () {
        ExtUtil.initIndexView(this, Tool.system.controller.IndexController);
        this.callParent(arguments);
    }
});
