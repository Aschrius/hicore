"use strict";
Ext.define('Tool.trend.bili.store.ZoneStore', {
    extend: 'Ext.data.Store',
    model: 'Tool.trend.bili.model.ZoneModel',
    autoLoad: false,
    nodeParam: 'id'
});