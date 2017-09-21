"use strict";
Ext.define('Tool.trend.bili.model.RankModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'id',
        'name',
        'type',
        'dataType',
        'tid',
        'delay',
        'rules',
        'delayType',
        {name: 'isRun', type: 'boolean'},
        {name: 'isShow', type: 'boolean'},
        {name: 'isStrict', type: 'boolean'},
    ],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/trend/bili/rank',
        idArray: ['userId']
    })
});

