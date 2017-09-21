"use strict";
Ext.define('Tool.sys.auth.model.RoleResBatchModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'roleId',
        'method',
        'data'
    ],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/sys/auth/role/:roleId/res/batch',
        idArray: ['roleId']
    })
});

