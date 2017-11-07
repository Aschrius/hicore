"use strict";
Ext.define('Tool.sys.auth.store.ResTreeStore', {
    extend: 'Ext.data.TreeStore',
    autoLoad: false,
    root: {
        expanded: false,
        text: "资源树",
        resTypeType: 0,
        resTypeId: 0,
        id: 1
    },
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/sys/auth/res/:id/res',
        idArray: ['id'],
        appendId: false
    }),
    nodeParam: 'id'
});