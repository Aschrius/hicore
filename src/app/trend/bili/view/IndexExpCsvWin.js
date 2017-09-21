Ext.define('Tool.trend.bili.view.IndexExpCsvWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_indexexpcsv-win',
    id: 'trend-bili_indexexpcsv-win',
    title: '数据源管理',
    initComponent: function () {

        let me = this;
        me.layout = 'fit';
        me.border = false;
        me.bodyBorder = false;
        me.modal = true;
        me.width = document.body.clientWidth * 0.8;
        me.height = document.body.clientHeight * 0.8;
        me.items = [{
            xtype: 'trend-bili_expcsv-grid',
            sortableColumns: false,
            dto: {
                showType: 2
            },
            store: 'Tool.trend.bili.store.IndexExpCsvStore',
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                boder: false,
                bodyBoder: false,
                items: [
                    '->',
                    {
                        text: '恢复',
                        doAction: 'doRank',
                        dto: {
                            type: 1007
                        }
                    }
                ],
            }, {
                xtype: 'pagingtoolbar',
                dock: 'bottom',
                displayInfo: true,
                store: 'Tool.trend.bili.store.IndexExpCsvStore'
            }]

        }];

        this.callParent();
    }
}); 