Ext.define('Tool.trend.bili.view.ZoneMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.trend-bili_zone-menu',
    id: 'trend-bili_zone-menu',
    initComponent: function () {
        let self = this;
        let interfaceIdSet = new Set();
        try {
            if (self.dto.parent.interfaceIdSet != null) interfaceIdSet = self.dto.parent.interfaceIdSet;
        } catch (e) {
        }
        self.style = {
            overflow: 'visible'
        };
        self.items = [{
            text: '<span style="color:green;">增</span>',
            iconCls: 'Vcardadd',
            hidden: !interfaceIdSet.has('post'),
            doAction: 'show',
            dto: {
                actionType: 1,
                winXtype: 'trend-bili_zone-win',
            }
        }, {
            text: '<span style="color:red;">删</span>',
            hidden: !interfaceIdSet.has('delete'),
            iconCls: 'Vcarddelete',
            doAction: 'doDel'
        }, {
            text: '改',
            hidden: !interfaceIdSet.has('put'),
            iconCls: 'Vcardedit',
            doAction: 'show',
            dto: {
                actionType: 2,
                winXtype: 'trend-bili_zone-win',
            }
        }, {
            text: '查',
            hidden: !interfaceIdSet.has('get'),
            iconCls: 'Vcard',
            doAction: 'show',
            dto: {
                actionType: 0,
                winXtype: 'trend-bili_zone-win',
            }
        }, {
            text: '采集',
            iconCls: 'Anchor',
            hidden: !interfaceIdSet.has('postTagTask'),
            doAction: 'doCollect',
            dto: {}
        }, {
            text: '采集历史',
            iconCls: 'Outline',
            hidden: !interfaceIdSet.has('getTag'),
            doAction: 'show',
            dto: {
                actionType: '',
                winXtype: 'trend-bili_zonetag-win',
            }
        }, {
            text: '数据源',
            iconCls: 'Outline',
            doAction: 'show',
            hidden: !interfaceIdSet.has('getExpCsvList'),
            dto: {
                actionType: '',
                winXtype: 'trend-bili_zoneexpcsv-win',
            }
        }];

        self.callParent(arguments);
    }


});

