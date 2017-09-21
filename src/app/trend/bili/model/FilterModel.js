"use strict";
Ext.define('Tool.trend.bili.model.FilterModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'id',
        'name',
    ],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/trend/bili/rank/:rankId/index/:indexId/filter',
        idArray: ['rankId', 'indexId']
    })
});

