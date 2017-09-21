Ext.define('Tool.trend.bili.store.VideoStore', {
    extend: 'Ext.data.Store',
    idProperty: ':name',
    fields: [
        {name: ':rank'},
        {name: ':name'},
        {name: ':length'},
        {name: ':offset'},
        {name: ':hit'},
        {name: 'width'},
        {name: 'height'},
        {name: 'rate'},
        {name: 'isAna'},
    ],
    data: [],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
});
