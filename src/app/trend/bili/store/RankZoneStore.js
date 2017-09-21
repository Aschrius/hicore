Ext.define('Tool.trend.bili.store.RankZoneStore', {
    extend: 'Ext.data.Store',
    storeId: 'trend-bili_rankzone-store',
    data: [
        {
            type: 28,
            name: '原创音乐'
        },
        {
            type: 30,
            name: 'VOCALOID·UTAU'
        },
        {
            type: 31,
            name: '翻唱'
        },
        {
            type: 59,
            name: '演奏'
        },
    ],
    idProperty: 'type',
    fields: [
        'type',
        'name',
    ],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
})
;
