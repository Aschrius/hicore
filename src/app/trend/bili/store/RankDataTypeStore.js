Ext.define('Tool.trend.bili.store.RankDataTypeStore', {
    extend: 'Ext.data.Store',
    idProperty: 'type',
    fields: [
        'type',
        'name',
    ],
    data: [
        {
            type: 1,
            name: '全量'
        },
        {
            type: 2,
            name: '增量'
        }
    ],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
});
