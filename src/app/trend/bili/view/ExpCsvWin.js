Ext.define('Tool.trend.bili.view.ExpCsvWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_expcsv-win',
    id: 'trend-bili_expcsv-win',
    title: '选择数据源',
    initComponent: function () {
        
        let me = this;
        me.layout = 'fit';
        me.border = false;
        me.bodyBorder = false;
        me.modal = true;
        me.width = document.body.clientWidth * 0.8;
        me.height = document.body.clientHeight * 0.8;
        // me.maximized = true;
        me.items = [{
            xtype: 'trend-bili_expcsv-grid',
            dto:{
                showType:1
            },
            store: 'Tool.trend.bili.store.ExpCsvStore',
            dockedItems: [{
                xtype: 'pagingtoolbar',
                dock: 'bottom',
                displayInfo: true,
                store: 'Tool.trend.bili.store.ExpCsvStore'
            }]

        }];

        this.callParent();
    }
}); 