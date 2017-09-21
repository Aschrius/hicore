"use strict";
Ext.define('Tool.sys.IndexController', {
    extend: 'Tool.base.controller.MvcController',
    statics: {},
    views: [
        'Tool.sys.IndexPan'
    ],
    controllers: [
        'Tool.sys.auth.controller.ResController',
        'Tool.sys.auth.controller.RoleController',
        'Tool.sys.auth.controller.UserController'
    ],
    stores: [],
    models: [
        'Tool.base.util.ExtUtil'
    ],
    init: async function () {
        var me = this;
        try {
            me.initEvent();
        } catch (e) {
            console.error(e);
        }
    },
    initEvent: function () {
        var me = this;
        this.control({});
    },
});
