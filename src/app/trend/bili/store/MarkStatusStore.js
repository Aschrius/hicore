Ext.define('Tool.trend.bili.store.MarkStatusStore', {
    extend: 'Ext.data.Store',
    storeId: 'trend-bili_mark_status-store',
    fields: [
        'display',
        'value',
        'display_no_style'
    ],
    data: [
        {value: 1, display_no_style: '收录', display: '<span style="color:green">收录</span>'},
        {value: 2, display_no_style: '存疑', display: '<span style="color:red">存疑</span>'},
        {value: -1, display_no_style: '排外', display: '<span style="color:red">排外</span>'},
    ],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
})
;
