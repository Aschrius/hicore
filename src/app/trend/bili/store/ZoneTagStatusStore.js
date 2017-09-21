Ext.define('Tool.trend.bili.store.ZoneTagStatusStore', {
    extend: 'Ext.data.Store',
    storeId: 'trend-bili_zonetagstatus-store',
    idProperty: 'status',
    fields: [
        'status',
        'name',
    ],
    data: [
        {
            status: -3,
            name: '重試'
        },
        {
            status: -2,
            name: '錯誤'
        },
        {
            status: -1,
            name: '廢棄'
        },
        {
            status: 3,
            name: '暫停'
        },
        {
            status: 2,
            name: '進行中'
        },
        {
            status: 1,
            name: '完成'
        },
    ],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
});
