"use strict";
Ext.define('Tool.sys.auth.store.UserStore', {
    extend: 'Ext.data.Store',
    model: 'Tool.sys.auth.model.UserModel',
    autoLoad: false,
    nodeParam: 'id'
});