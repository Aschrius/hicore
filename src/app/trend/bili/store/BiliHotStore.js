Ext.define('Tool.trend.bili.store.BiliHotStore', {
    extend: 'Ext.data.Store',
    storeId: 'trend-bili_bili_hot-store',
    fields: [],
    proxy: Tool.trend.bili.proxy.BiliProxy.create()
});
