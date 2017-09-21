Ext.define('Tool.trend.bili.store.RankTeamStore', {
    extend: 'Ext.data.Store',
    idProperty: 'type',
    fields: [
        'type',
        'name'
    ],
    data: [
        {
            type: 1,
            name: '运营组'
        },
        {
            type: 2,
            name: '收录组'
        },
        {
            type: 3,
            name: '视频组'
        },
        {
            type: 4,
            name: '围观组'
        }
    ],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
});
