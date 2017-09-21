Ext.define('Tool.trend.bili.store.RankTypeStore', {
    extend: 'Ext.data.Store',
    idProperty: 'type',
    fields: [
        'type',
        'name'
    ],
    data: [
        {
            type: 0,
            name: '特刊'
        },
        {
            type: 1,
            name: '周刊'
        },
        {
            type: 2,
            name: '月刊'
        },
        {
            type: 3,
            name: '季刊'
        },
        {
            type: 4,
            name: '年刊'
        }
    ],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
});
