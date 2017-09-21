Ext.define('Tool.sys.auth.view.UserRoleWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.sys-auth_user_role-win',
    id: 'sys-auth_user_role-win',
    dto: {
        actionType: '',// 0.详情,1.授权树
        record: null,
    },
    initComponent: function () {
        let me = this;
        me.layout = 'fit';
        me.title = "用户授权角色";
        me.iconCls = 'Group';

        me.modal = true;
        me.resizable = false;
        me.height = 300;
        me.width = 400;
        me.items = [
            {
                xtype: 'grid',
                border: false,
                store: 'Tool.sys.auth.store.UserRoleStore',
                columns: [{
                    xtype: 'rownumberer',
                    flex: 1
                }, {
                    text: '名称',
                    dataIndex: 'name',
                    flex: 3
                }, {
                    text: '备注',
                    dataIndex: 'description',
                    flex: 6
                }, {
                    xtype: 'checkcolumn',
                    text: '授权',
                    dataIndex: 'active'
                }],
                dockedItems: [{
                    xtype: 'pagingtoolbar',
                    dock: 'bottom',
                    displayInfo: true,
                    store: 'Tool.sys.auth.store.UserRoleStore',
                }]
            }, {
                xtype: 'form',
                items: [{
                    fieldLabel: 'id',
                    name: 'id',

                }],
                hidden: true
            },

        ];

        me.callParent(arguments);
    }
});