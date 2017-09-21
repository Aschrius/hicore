Ext.define('Tool.trend.bili.store.IndexStatusStore', {
    extend: 'Ext.data.Store',
    storeId: 'trend-bili_index_status-store',
    fields: [
        'id',
        'field',
        'name',
    ],
    data: [
        {
            id: -1,
            field: 'ERROR',
            name: '错误'
        }, {
            id: 0,
            field: 'INIT',
            name: '初始化'
        }, {
            id: 1,
            field: 'SUCCESS',
            name: '完成'
        }, {
            id: 2,
            field: 'CALCULATE_CONFIRM',
            name: '确认数据'
        }, {
            id: 3,
            field: 'CALCULATE_FINISH',
            name: '统计完毕'
        }, {
            id: 4,
            field: 'CALCULATE_PROCESSING',
            name: '统计中'

        }, {
            id: 5,
            field: 'CALCULATE_WAIT',
            name: '统计待执行'
        }, {
            id: 6,
            field: 'CREATE',
            name: '创建'
        }
    ],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
});
