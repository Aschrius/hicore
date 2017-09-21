Ext.define('Tool.trend.bili.view.ZonePan', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.trend-bili_zone-pan',
    id: 'trend-bili_zone-pan',
    title: '分区',
    initComponent: function () {
        let tagStore = Ext.StoreMgr.get('trend-bili_zonetagstatus-store');
        let me = this;
        me.layout = 'fit';
        me.border = false;
        me.bodyBorder = false;
        me.items = [{
            xtype: 'grid',
            border: false,
            store: 'Tool.trend.bili.store.ZoneStore',
            tbar: [
                "->", {
                    xtype: 'button',
                    text: '增',
                    iconCls: 'Vcardadd',
                    doAction: 'show',
                    dto: {
                        actionType: 1,
                        winXtype: 'trend-bili_zone-win',
                    }
                }
            ],
            columns: [{
                xtype: 'rownumberer',
                flex: 1
            }, {
                text: 'id',
                dataIndex: 'id',
                flex: 2
            }, {
                text: '名称',
                dataIndex: 'name',
                flex: 3
            }, {
                text: '状态',
                dataIndex: 'status',
                flex: 1
            }, {
                text: '采集',
                dataIndex: 'tagStatus',
                width:75,
                renderer: function (value) {
                    let idx = tagStore.find('status', value);
                    let statusRecord = tagStore.getAt(idx);
                    return statusRecord.get('name');

                }
            }, {
                header: '',
                minWidth: 60,
                dataIndex: 'cursor',
                xtype: 'gridcolumn',
                flex: 6,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    let total = record.get('total');
                    let val = parseInt(value / total * 100, 10);
                    return "<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #8DB2E3 solid;'><div style='height:12px;width:" + val + "%;background-color:#8DB2E3;border: 0px;color: black;'>" +

                        value + '/' + total +
                        '(' + val + "%)</div></div>";
                }

            }],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                dock: 'bottom',
                displayInfo: true,
                store: 'Tool.trend.bili.store.ZoneStore',
            }]

        }];

        this.callParent();
    }
}); 