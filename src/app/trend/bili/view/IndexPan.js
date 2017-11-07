Ext.define('Tool.trend.bili.view.IndexPan', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.trend-bili_index-pan',
    id: 'trend-bili_index-pan',
    title: '主控',
    initComponent: function () {

        let self = this;
        let interfaceIdSet = new Set();
        try {
            if (self.dto.interfaceIdSet != null) interfaceIdSet = self.dto.interfaceIdSet;
        } catch (e) {
        }


        self.layout = 'fit';
        self.border = false;
        self.bodyBorder = false;
        self.items = [{
            xtype: 'grid',
            border: false,
            store: 'Tool.trend.bili.store.IndexStore',
            tbar: [
                "->", {
                    xtype: 'button',
                    hidden: !interfaceIdSet.has('post'),
                    text: '新建',
                    iconCls: 'Vcardadd',
                    doAction: 'show',
                    dto: {
                        actionType: 1,
                        winXtype: 'trend-bili_expcsv-win',
                    }
                }
            ],
            columns: [{
                xtype: 'rownumberer',
                flex: 1
            }, {
                text: '期刊',
                dataIndex: 'batchNo',
                flex: 3
            }, {
                text: '创建日期',
                dataIndex: 'createdDate',
                flex: 6
            }, {
                text: '截止日期',
                dataIndex: 'deadline',
                flex: 6
            }, {
                text: '状态',
                dataIndex: 'status',
                flex: 3,
                renderer: function (value) {
                    let name = null;
                    try {

                        let statusStore = Ext.StoreMgr.get('trend-bili_index_status-store');
                        let index = statusStore.find('id', value);
                        let record = statusStore.getAt(index);

                        name = record.get('name');
                    } catch (e) {
                        console.log(e);
                    }
                    return name;
                }
            }],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                dock: 'bottom',
                displayInfo: true,
                store: 'Tool.trend.bili.store.IndexStore'
            }]

        }];

        this.callParent();
    }
}); 