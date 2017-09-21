Ext.define('Tool.sys.auth.model.RoleModel', {
    extend: 'Ext.data.Model',
    statics: {},
    idProperty: 'id',
    fields: ['id', 'description', 'name'],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/sys/auth/role',
        idArray: []
    })
});