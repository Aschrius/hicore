Ext.define('Tool.trend.bili.view.RankPan', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.trend-bili_rank-pan',
    id: 'trend-bili_rank-pan',
    title: '榜单',
    initComponent: function () {
        let typeStore = Tool.trend.bili.store.RankTypeStore.create();
        let dataTypeStore = Tool.trend.bili.store.RankDataTypeStore.create();
        let zoneStore = Tool.trend.bili.store.RankZoneStore.create();


        let me = this;
        me.layout = 'fit';
        me.border = false;
        me.bodyBorder = false;
        me.items = [{
            xtype: 'grid',
            border: false,
            store: 'Tool.trend.bili.store.RankStore',
            tbar: [
                "->", {
                    xtype: 'button',
                    text: '增',
                    iconCls: 'Vcardadd',
                    doAction: 'show',
                    dto: {
                        actionType: 1,
                        winXtype: 'trend-bili_rank-win',
                    }
                }
            ],
            columns: [{
                xtype: 'rownumberer',
                sortable: false,
                flex: 1
            }, {
                text: 'id',
                dataIndex: 'id',
                sortable: false,
                width: 60
            }, {
                text: '名称',
                dataIndex: 'name',
                sortable: false,
                flex: 4
            }, {
                text: '类型',
                dataIndex: 'type',
                sortable: false,
                width: 50,
                renderer: function (value, meta, record) {
                    let rowIndex = typeStore.find("type", value);
                    let record_ = typeStore.getAt(rowIndex);
                    return record_.get('name')
                }
            }, {
                text: '数据',
                dataIndex: 'dataType',
                sortable: false,
                width: 50,
                renderer: function (value, meta, record) {
                    let rowIndex = dataTypeStore.find("type", value);
                    let record_ = dataTypeStore.getAt(rowIndex);
                    return record_.get('name')
                }
            }, {
                text: '区',
                dataIndex: 'zoneId',
                sortable: false,
                flex: 2,
                renderer: function (value, meta, record) {
                    let rowIndex = zoneStore.find("type", value);
                    let record_ = zoneStore.getAt(rowIndex);
                    return record_.get('name')
                }
            }, {
                text: '模式',
                dataIndex: 'isStrict',
                sortable: false,
                width: 50,
                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                    return value == true ? '严格' : '排外';
                }
            }, {
                text: '执行',
                dataIndex: 'isRun',
                sortable: false,
                width: 50,
                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                    return value == true ? '<span style="color: green;">是</span>' : '<span style="color: red;">否</span>';
                }
            }, {
                text: '展示',
                dataIndex: 'isShow',
                sortable: false,
                width: 50,
                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                    return value == true ? '<span style="color: green;">是</span>' : '<span style="color: red;">否</span>';
                }
            }],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                dock: 'bottom',
                displayInfo: true,
                store: 'Tool.trend.bili.store.RankStore',
            }]

        }];

        this.callParent();
    }
}); 