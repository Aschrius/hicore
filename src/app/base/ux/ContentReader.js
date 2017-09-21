/**
 * 废弃没用
 */
Ext.define('Tool.base.ux.ContentReader', {
    extend: 'Ext.data.reader.Reader',
    requires: [
        'Ext.dom.Query'
    ],
    alternateClassName: 'Tool.base.ux.ContentReader',
    alias: 'reader.content',
    config: {},

    getResponseData: function (response) {
        return response;
    },

    getData: function (data) {
        return data;
    },
    readRecords: function (response, readOptions, internalReadOptions) {
        return this.callParent([response, readOptions, internalReadOptions]);
    },
    getSuccess: Ext.emptyFn,
    getTotal: Ext.emptyFn,
    getSuccessProperty: function () {
        return false;
    },
    getTotalProperty: function () {
        return false;
    }

});