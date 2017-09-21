"use strict";
Ext.define('Tool.trend.bili.store.ZoneExpCsvStore', {
    extend: 'Ext.data.Store',
    model: 'Tool.trend.bili.model.ZoneExpCsvModel',
    autoLoad: false,
    nodeParam: 'id'
});