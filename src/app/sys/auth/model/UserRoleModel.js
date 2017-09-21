Ext.define('Tool.sys.auth.model.UserRoleModel', {
    extend: 'Ext.data.Model',
    statics: {},
    idProperty: 'id',
    fields: ['id', 'description', 'name', 'active'],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/sys/auth/user/:userId/role',
        idArray: ['userId']
    }),
});