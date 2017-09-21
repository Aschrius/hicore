Ext.define('Tool.trend.bili.model.TagTaskModel', {
    extend: 'Ext.data.Model',
    statics: {},
    idProperty: 'id',
    fields: ['id', 'type', 'targetId', 'ext'],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/trend/bili/tag/:tagId/task',
        idArray: ['tagId']
    }),
});