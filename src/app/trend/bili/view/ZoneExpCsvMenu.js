Ext.define('Tool.trend.bili.view.ZoneExpCsvMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.trend-bili_zoneexpcsv-menu',
    id: 'trend-bili_zoneexpcsv-menu',
    initComponent: function () {
        var me = this;
        me.style = {
            overflow: 'visible'
        };
        me.items = [
            {
                text: '数据恢复',
                iconCls: 'Group',
                doAction: 'doSrcRecover',
            },
        ];

        me.callParent(arguments);
    }
});

