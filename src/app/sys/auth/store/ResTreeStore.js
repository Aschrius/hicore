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
    // TODO 有空改成通用的
    proxy: ExtUtil.getRestModelProxyTpl(AT.app.server + '/sys/auth/res/:id/res', ['id'], {appendId: false}),
    nodeParam: 'id'
});