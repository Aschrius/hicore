"use strict";
Ext.define('Tool.trend.bili.model.UserRankModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'id',
        'username',
        'type',
        'pic',
        'mid',
        'rankId',
        'userId',
    ],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/trend/bili/user/:userId/rank',
        idArray: ['userId']
    })
});

