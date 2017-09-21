"use strict";
Ext.define('Tool.trend.bili.model.PartModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/trend/bili/rank/:rankId/index/:indexId/part',
        idArray: ['rankId', 'indexId']
    })
});

