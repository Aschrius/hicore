"use strict";
Ext.define('Tool.trend.bili.model.RankRuleModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {name: 'id'},
        {name: 'version'},
        {name: 'description'},
        {name: 'filters'},
        {name: 'rankingId'},
        {name: 'scoreCsvHeader'},
        {name: 'scoreScript'},
        {name: 'resultScript'},
    ],
    // hasMany: {model: 'Tool.trend.model.RankRankingRuleFilterModel', name: 'filters'},
    // belongsTo: {model: 'Tool.trend.model.RankRankingModel'},

    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
});
