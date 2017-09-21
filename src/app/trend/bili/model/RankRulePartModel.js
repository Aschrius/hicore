"use strict";
Ext.define('Tool.trend.bili.model.RankRulePartModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {name: 'id'},
        {name: 'name'},
        {name: 'description'},
        {name: 'script'},
        {name: 'scriptName'},
        {name: 'version'},
        {name: 'rankingId'},
    ],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
});
