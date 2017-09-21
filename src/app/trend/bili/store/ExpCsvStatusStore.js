Ext.define('Tool.trend.bili.store.ExpCsvStatusStore', {
    extend: 'Ext.data.Store',
    storeId: 'trend-bili_expcsv_status-store',
    fields: [
        'name',
        'id'
    ],
    data: [
        {id: 1, name: '<span style="color:green">完成</span>'},
        {id: 2, name: '<span style="color:grey">备份</span>'},
        {id: 3, name: '<span style="color:grey">压缩</span>'},
        {id: 4, name: '<span style="color:grey">执行</span>'},
        {id: 5, name: '<span style="color:grey">等待</span>'},
        {id: 6, name: '<span style="color:grey">初始</span>'},
        {id: -1, name: '<span style="color:red">禁止</span>'},
        {id: -2, name: '<span style="color:red">错误</span>'},
    ],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
})
;
