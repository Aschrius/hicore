Ext.define('Tool.trend.bili.model.ZoneTaskModel', {
    extend: 'Ext.data.Model',
    statics: {},
    idProperty: 'id',
    fields: ['id', 'type', 'targetId', 'ext'],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/trend/bili/zone/:zoneId/task',
        idArray: ['zoneId']
    })
});