"use strict";
Ext.define('Tool.base.model.LoginModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'id',
        'email',
        'password',
    ],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + 'session',
        idArray: []
    })
})
;

