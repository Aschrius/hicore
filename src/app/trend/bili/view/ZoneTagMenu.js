Ext.define('Tool.trend.bili.view.ZoneTagMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.trend-bili_zonetag-menu',
    id: 'trend-bili_zonetag-menu',
    initComponent: function () {
        var me = this;
        me.style = {
            overflow: 'visible'
        };
        me.items = [{
            text: '<span style="color:green;">继续采集</span>',
            iconCls: 'Vcardadd',
            doAction: 'reCollect',
            dto: {}
        }, {
            text: '<span style="color:green;">导出数据源</span>',
            iconCls: 'Vcardadd',
            doAction: 'doExport',
            dto: {}
        }, {
            text: '<span style="color:green;">清空数据</span>',
            iconCls: 'Vcardadd',
            doAction: 'doEmpty',
            dto: {}
        }];

        me.callParent(arguments);
    }
});

