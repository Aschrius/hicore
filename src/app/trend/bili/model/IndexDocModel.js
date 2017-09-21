"use strict";
Ext.define('Tool.trend.bili.model.IndexDocModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'aid',
        'play',
        'favorites',
        'review',
        'video_review',
        'credit',
        'coins',
        'score',
        'status',
        'mark_status',
        'oldRank',
        'oldFlag',
        'rank',
        'flag',
        'uname',
        'others',
        'title',
        'mid',
        'pic',
        'createdDateStr'

    ],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/trend/bili/rank/:rankId/index/:indexId/doc',
        idArray: ['rankId', 'indexId']
    })
});

