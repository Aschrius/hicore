"use strict";
Ext.define('Tool.sys.auth.store.UserResStore', {
    extend: 'Ext.data.TreeStore',
    model: 'Tool.sys.auth.model.UserResModel',
    root: {
        id: 1,
        expanded: false,
        text: "授权资源树",
    }
});