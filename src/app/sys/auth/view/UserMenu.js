Ext.define('Tool.sys.auth.view.UserMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.sys-auth_user-menu',
    id: 'sys-auth_user-menu',
    initComponent: function () {
        let self = this;
        let interfaceIdSet = new Set();
        try {
            interfaceIdSet = self.dto.parent.interfaceIdSet;
        } catch (e) {
            console.error(e);
        }

        self.style = {
            overflow: 'visible'
        };
        self.items = [{
            text: '<span style="color:green;">增</span>',
            iconCls: 'Vcardadd',
            doAction: 'show',
            hidden: !interfaceIdSet.has('post'),
            dto: {
                actionType: 1,
                winXtype: 'sys-auth_user-win',
            }
        }, {
            text: '改',
            iconCls: 'Vcardedit',
            doAction: 'show',
            hidden: !interfaceIdSet.has('put'),
            dto: {
                actionType: 2,
                winXtype: 'sys-auth_user-win',
                parent: self.dto
            }
        }, {
            text: '查',
            iconCls: 'Vcard',
            hidden: !interfaceIdSet.has('get'),
            doAction: 'show',
            dto: {
                actionType: 0,
                winXtype: 'sys-auth_user-win',
                parent: self.dto
            }
        }, {
            text: '角色',
            iconCls: 'Group',
            doAction: 'show',
            hidden: !interfaceIdSet.has('getRole'),
            dto: {
                actionType: 'assign',
                winXtype: 'sys-auth_user_role-win',
                parent: self.dto
            }
        }, {
            text: '授权',
            iconCls: 'Checkerror',
            hidden: !interfaceIdSet.has('postResBatch'),
            doAction: 'show',
            dto: {
                actionType: 'assign',
                winXtype: 'sys-auth_user_res-win',
                parent: self.dto
            }
        }, {
            text: '详情',
            iconCls: 'Outline',
            hidden: !interfaceIdSet.has('getRes'),
            doAction: 'show',
            dto: {
                showType: '',
                winXtype: 'sys-auth_user_res-win',
                parent: self.dto
            }
        }];

        self.callParent(arguments);
    }
});

