Ext.define('Tool.trend.bili.store.YmlStore', {
    extend: 'Ext.data.Store',
    idProperty: 'name',
    fields: [
        {name: 'name'},
        {name: 'path'}
    ],
    data: [],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
});
