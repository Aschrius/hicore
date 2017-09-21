Ext.define('Tool.trend.bili.store.BlackStatusStore', {
    extend: 'Ext.data.Store',
    storeId: 'trend-bili_black_status-store',
    fields: [
        'display',
        'value',
    ],
    data: [
        {value: 1, display_no_style: '绿的', display: '<span style="color:green"><strong>绿的</strong></span>'},
        {value: -1, display_no_style: '', display: '<span style="color:gray"></span>'},
    ],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
})
;
