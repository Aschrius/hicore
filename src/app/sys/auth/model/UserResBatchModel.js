"use strict";
Ext.define('Tool.sys.auth.model.UserResBatchModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {name: 'id', type: 'int', defaultValue: null, allowNull: true},
        {name: 'pid', type: 'int', defaultValue: 1, allowNull: false},
        'msg',
        'text',
        'name',
        'leaf',
        // 'checked',
        'expanded',
        'xtype',
        'orderNum',
        'executeUrl',
        'otherUrl',
        'resTypeId',
        'resTypeType',
        'resTypeName',
        'extra'
    ],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/sys/auth/user/:userId/res/batch',
        idArray: ['userId']
    }),
});

