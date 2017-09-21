Ext.define('Tool.trend.bili.model.ZoneExpCsvModel', {
    extend: 'Ext.data.Model',
    statics: {},
    idProperty: 'id',
    convertOnSet: false,
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
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/trend/bili/zone/:zoneId/expCsv',
        idArray: ['zoneId']
    })
});