Ext.define('Tool.trend.bili.store.MarkStore', {
    extend: 'Ext.data.Store',
    storeId: 'trend-bili_mark-store',
    limitParam: 'limit',
    pageParam: 'page',
    model: 'Tool.trend.bili.model.MarkModel'
});
