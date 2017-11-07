"use strict";
Ext.define('Tool.sys.auth.model.RoleResModel', {
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
    // proxy: ExtUtil.getRestModelProxyTpl(AT.app.server + '/sys/auth/role/:roleId/res', ['roleId'], null, 'tree'),
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/sys/auth/role/:roleId/res',
        idArray: ['roleId'],
        reader: {
            type: 'json',
            transform: {
                fn: function (data) {
                    let returnData = null;

                    // 处理数据前的预处理。提取数据给框架用
                    try {
                        let success = data.code == 0;
                        if (typeof (data.data.children) != 'undefined') {
                            //TODO tree 的 children
                            data.success = success;
                            data.children = data.data.children;
                            returnData = data;
                        } else if (Array.isArray(data.data.list)) {
                            data.data.success = success;
                            returnData = data.data;
                        } else {
                            data.success = success;
                            data.list = data.data;
                            returnData = data;
                        }

                    } catch (e) {
                        returnData = data;
                    }

                    // this.dto = returnData;
                    console.info('processJson:');
                    console.log(returnData);
                    return returnData;

                },
                scope: this
            },
            rootProperty: 'children',
            totalProperty: 'total',
            successProperty: 'success'
        },
    }),
});

