Ext.define('Tool.trend.bili.store.PickupStatusStore', {
    extend: 'Ext.data.Store',
    storeId: 'trend-bili_pickup_status-store',
    fields: [
        'display',
        'value',
        'display_no_style'
    ],
    data: [
        {value: 2, display_no_style: '预推', display: '<span style="color:dodgerblue">预推</span>'},
        {value: 1, display_no_style: '推荐', display: '<span style="color:deepskyblue"><strong>推荐</strong></span>'},
        {value: -1, display_no_style: '不推', display: '<span style="color:red">不推</span>'},
        {value: -2, display_no_style: '绿ta', display: '<span style="color:green">拉黑</span>'},
    ],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
})
;
