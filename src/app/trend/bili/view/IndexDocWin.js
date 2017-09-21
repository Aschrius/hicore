Ext.define('Tool.trend.bili.view.IndexDocWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_index_doc-win',
    id: 'trend-bili_index_doc-win',
    title: 'result-doc',
    initComponent: function () {
        let me = this;
        me.layout = 'fit';
        me.border = false;
        me.bodyBorder = false;
        me.modal = true;
        me.width = document.body.clientWidth * 0.8;
        me.height = document.body.clientHeight * 0.8;
        me.items = [{
            xtype: 'trend-bili_doc-pan',
            sortableColumns: false,
            dto: {
                showType: 2
            },
            store: 'Tool.trend.bili.store.DocStore',
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