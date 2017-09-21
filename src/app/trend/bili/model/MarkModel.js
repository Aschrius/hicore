"use strict";
Ext.define('Tool.trend.bili.model.MarkModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'aid',
        'userId',
        'username',
        'rank',
        'description',
        'rankId',
        'status',
        'title',
        'author',
        'mid',
        'blackStatus',
        'pickupStatus',
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
        },
    ],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + 'trend/bili/rank/:rankId/mark',
        idArray: ['rankId']
    })
});

