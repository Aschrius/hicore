"use strict";
Ext.define('Tool.trend.bili.store.ZoneTagStore', {
    extend: 'Ext.data.Store',
    model: 'Tool.trend.bili.model.ZoneTagModel',
    autoLoad: false,
    nodeParam: 'id'
});