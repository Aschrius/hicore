// "use strict";
Ext.define('Tool.sys.auth.model.ResModel', {
    extend: 'Ext.data.TreeModel',
    idProperty: 'id',
    fields: [
        {name: 'id', type: 'int', defaultValue: null, allowNull: true},
        {name: 'pid', type: 'int', defaultValue: 1, allowNull: false},
        'msg',
        'text',
        'name',
        'leaf',
        'checked',
        'expanded',
        'xtype',
        'orderNum',

        'urlRegExp',
        'urlMethod',
        'interfaceIds',

        'extraPermissionJson',

        'resTypeId',
        'resTypeType',
        'resTypeName',
        'extra'
    ],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/sys/auth/res',
        idArray: []
    })
});
