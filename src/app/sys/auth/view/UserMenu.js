Ext.define('Tool.sys.auth.view.UserMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.sys-auth_user-menu',
    id: 'sys-auth_user-menu',
    initComponent: function () {
        let me = this;
        me.style = {
            overflow: 'visible'
        };
        me.items = [{
            text: '<span style="color:green;">增</span>',
            iconCls: 'Vcardadd',
            doAction: 'show',
            dto: {
                actionType: 1,
                winXtype: 'sys-auth_user-win',
            }
        }, "-", {
            text: '改',
            iconCls: 'Vcardedit',
            doAction: 'show',
            dto: {
                actionType: 2,
                winXtype: 'sys-auth_user-win',
            }
        }, "-", {
            text: '查',
            iconCls: 'Vcard',
            doAction: 'show',
            dto: {
                actionType: 0,
                winXtype: 'sys-auth_user-win',
            }
        }, '-', {
            text: '角色',
            iconCls: 'Group',
            doAction: 'show',
            dto: {
                actionType: 'assign',
                winXtype: 'sys-auth_user_role-win',
            }
        }, '-', {
            text: '授权',
            iconCls: 'Checkerror',
            doAction: 'show',
            dto: {
                actionType: 'assign',
                winXtype: 'sys-auth_user_res-win',
            }
        }, '-', {
            text: '详情',
            iconCls: 'Outline',
            doAction: 'show',
            dto: {
                showType: '',
                winXtype: 'sys-auth_user_res-win',
            }
        }];

        me.callParent(arguments);
    }
});

