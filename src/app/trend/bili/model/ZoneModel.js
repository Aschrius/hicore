Ext.define('Tool.trend.bili.model.ZoneModel', {
    extend: 'Ext.data.Model',
    statics: {},
    idProperty: 'id',
    fields: ['id', 'status', 'name'],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/trend/bili/zone',
        idArray: []
    })
});