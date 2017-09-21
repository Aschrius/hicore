Ext.define('Tool.trend.bili.view.ZoneMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.trend-bili_zone-menu',
    id: 'trend-bili_zone-menu',
    initComponent: function () {
        var me = this;
        me.style = {
            overflow: 'visible'
        };
        me.items = [{
            text: '<span style="color:green;">增</span>',
            iconCls: 'Vcardadd',
            doAction: 'show',
            dto: {
                actionType: 1,
                winXtype: 'trend-bili_zone-win',
            }
        }, "-", {
            text: '<span style="color:red;">删</span>',
            iconCls: 'Vcarddelete',
            doAction: 'doDel'
        }, "-", {
            text: '改',
            iconCls: 'Vcardedit',
            doAction: 'show',
            dto: {
                actionType: 2,
                winXtype: 'trend-bili_zone-win',
            }
        }, "-", {
            text: '查',
            iconCls: 'Vcard',
            doAction: 'show',
            dto: {
                actionType: 0,
                winXtype: 'trend-bili_zone-win',
            }
        }, '-', {
            text: '采集',
            iconCls: 'Anchor',
            doAction: 'doCollect',
            dto: { }
        }, '-', {
            text: '采集历史',
            iconCls: 'Outline',
            doAction: 'show',
            dto: {
                actionType: '',
                winXtype: 'trend-bili_zonetag-win',
            }
        }, '-', {
            text: '数据源',
            iconCls: 'Outline',
            doAction: 'show',
            dto: {
                actionType: '',
                winXtype: 'trend-bili_zoneexpcsv-win',
            }
        }];

        me.callParent(arguments);
    }
});

