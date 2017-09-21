"use strict";
Ext.define('Tool.trend.bili.model.IndexResultModel', {
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
        {
            name: 'createdDate',
            convert: function (value) {
                let ret = null;
                if (typeof(value) == 'undefined' || value == null || value == 0) {
                } else {
                    ret = Ext.Date.format(new Date(value), "Y-m-d H:i");

                }
                return ret;
            }
        }

    ],
    proxy: ExtUtil.getRestModelProxyTpl(AT.apiServer + '/trend/bili/rank/:rankId/index/:indexId/doc', ['rankId', 'indexId'], {})
});

