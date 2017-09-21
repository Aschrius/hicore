Ext.define('Tool.sys.auth.model.UserModel', {
    extend: 'Ext.data.Model',
    statics: {},
    idProperty: 'id',
    fields: ['id', 'status', 'username', 'email'],
    // proxy: ExtUtil.getRestModelProxyTpl(AT.apiServer + '/sys/auth/user', [], {}),
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/sys/auth/user',
        idArray: []
    }),
});