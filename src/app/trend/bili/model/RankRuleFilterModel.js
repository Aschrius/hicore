"use strict";
Ext.define('Tool.trend.bili.model.RankRuleFilterModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {name: 'id'},
        {name: 'tag'},
        {name: 'name'},
        {name: 'description'},
        {name: 'script'},
        {name: 'scriptName'},
        {name: 'version'},
        {name: 'rankingId'},
    ],
    // belongsTo: {model: 'Tool.trend.model.RankRankingRuleModel'},
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
});
