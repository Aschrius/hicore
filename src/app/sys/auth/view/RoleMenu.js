Ext.define('Tool.sys.auth.view.RoleMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.sys-auth_role-menu',
    id: 'sys-auth_role-menu',
    initComponent: function () {
        var me = this;
        me.style = {
            overflow: 'visible'
        };
        me.items = [{
            text: '<span style="color:green;">增</span>',
            iconCls: 'Vcardadd',
            doAction: 'show',
            dto: {
                actionType: 1,
                winXtype: 'sys-auth_role-win',
            }
        }, "-", {
            text: '<span style="color:red;">删</span>',
            iconCls: 'Vcarddelete',
            doAction: 'doDel'
        }, "-", {
            text: '改',
            iconCls: 'Vcardedit',
            doAction: 'show',
            dto: {
                actionType: 2,
                winXtype: 'sys-auth_role-win',
            }
        }, "-", {
            text: '查',
            iconCls: 'Vcard',
            doAction: 'show',
            dto: {
                actionType: 0,
                winXtype: 'sys-auth_role-win',
            }
        }, '-', {
            text: '授权',
            iconCls: 'Checkerror',
            doAction: 'show',
            dto: {
                actionType: 'assign',
                winXtype: 'sys-auth_role_res-win',
            }
        }, '-', {
            text: '详情',
            iconCls: 'Outline',
            doAction: 'show',
            dto: {
                actionType: '',
                winXtype: 'sys-auth_role_res-win',
            }
        }];

        me.callParent(arguments);
    }
});

