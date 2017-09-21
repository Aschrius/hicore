Ext.define('Tool.trend.bili.store.CsvDataStore', {
    extend: 'Ext.data.Store',
    idProperty: ':name',
    fields: [
        {name: 'rank'},
        {name: 'aid'},
        {name: 'title'},
        {name: 'score'},
        {name: 'up'},
        {name: 'date'},
        {name: 'play'},
        {name: 'favorites'},
        {name: 'review'},
        {name: 'videoReview'},
        {name: 'coins'}
    ],
    data: [],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
});
