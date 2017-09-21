"use strict";
Ext.define('Tool.trend.bili.store.UserRankStore', {
    extend: 'Ext.data.Store',
    storeId: 'trend-bili_user_rank-store',
    autoLoad: false,
    model: 'Tool.trend.bili.model.UserRankModel'
});