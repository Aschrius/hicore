Ext.define('Tool.trend.bili.store.RankDelayTypeStore', {
    extend: 'Ext.data.Store',
    data: [
        {
            type: 0,
            name: '天'
        },
        {
            type: 1,
            name: '周'
        },
        {
            type: 2,
            name: '月'
        },
        {
            type: 3,
            name: '季'
        },
        {
            type: 4,
            name: '年'
        }
    ],
    idProperty: 'type',
    fields: [
        'type',
        'name',
    ],

    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
});
