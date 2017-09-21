"use strict";
Ext.define('Tool.trend.bili.model.IndexExpCsvModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'id',
        'status',
        'batchNo',
        'tid',
        'tagId',
        'type',
        'backup',
        'oldBatchNo',
        'newBatchNo',
        {
            name: 'oldDate',
            convert: function (value) {
                let ret = null;
                if (typeof(value) == 'undefined' || value == null || value == 0) {
                } else {
                    ret = Ext.Date.format(new Date(value), "Y-m-d H:i");

                }
                return ret;
            }
        },
        {
            name: 'newDate',
            convert: function (value) {
                let ret = null;
                if (typeof(value) == 'undefined' || value == null || value == 0) {
                } else {
                    ret = Ext.Date.format(new Date(value), "Y-m-d H:i");

                }
                return ret;
            }
        },
        {
            name: 'createDate',
            convert: function (value) {
                let ret = null;
                if (typeof(value) == 'undefined' || value == null || value == 0) {
                } else {
                    ret = Ext.Date.format(new Date(value), "Y-m-d H:i");

                }
                return ret;
            }
        },
        {
            name: 'updateDate',
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
    proxy: ExtUtil.getRestModelProxyTpl(AT.apiServer +'/trend/bili/rank/:rankId/index/:indexId/expCsv', ['rankId', 'indexId'], {})
});

