Ext.define('Tool.trend.bili.store.CsvStore', {
    extend: 'Ext.data.Store',
    idProperty: 'name',
    fields: [
        {name: 'name'},
        {name: 'path'}
    ],
    data: [],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
});
