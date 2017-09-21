"use strict";
Ext.define('Tool.trend.bili.model.MarkBatchModel', {
    extend: 'Ext.data.Model',
    fields: [
        'method',
        'data'
    ],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/trend/bili/rank/:rankId/mark/batch',
        idArray: ['rankId']
    })
});

