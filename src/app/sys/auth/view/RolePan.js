Ext.define('Tool.sys.auth.view.RolePan', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sys-auth_role-pan',
    id: 'sys-auth_role-pan',
    title: '角色',
    initComponent: function () {
        let self= this;
        self.layout = 'fit';
        self.border = false;
        self.bodyBorder = false;
        self.items = [{
            xtype: 'grid',
            border: false,
            store: 'Tool.sys.auth.store.RoleStore',
            tbar: [
                "->", {
                    xtype: 'button',
                    text: '增',
                    iconCls: 'Vcardadd',
                    doAction: 'show',
                    dto: {
                        actionType: 1,
                        winXtype: 'sys-auth_role-win',
                    }
                }
            ],
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
            }],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                dock: 'bottom',
                displayInfo: true,
                store: 'Tool.sys.auth.store.RoleStore',
            }]

        }];

        this.callParent();
    }
}); 