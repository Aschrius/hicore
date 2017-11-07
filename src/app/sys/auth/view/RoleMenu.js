Ext.define('Tool.sys.auth.view.RoleMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.sys-auth_role-menu',
    id: 'sys-auth_role-menu',
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
                winXtype: 'sys-auth_role-win',
                parent: self.dto
            }
        }, {
            text: '<span style="color:red;">删</span>',
            hidden: !interfaceIdSet.has('delete'),
            iconCls: 'Vcarddelete',
            doAction: 'doDel'
        }, {
            text: '改',
            hidden: !interfaceIdSet.has('put'),
            iconCls: 'Vcardedit',
            doAction: 'show',
            dto: {
                actionType: 2,
                winXtype: 'sys-auth_role-win',
                parent: self.dto
            }
        }, {
            text: '查',
            hidden: !interfaceIdSet.has('get'),
            iconCls: 'Vcard',
            doAction: 'show',
            dto: {
                actionType: 0,
                winXtype: 'sys-auth_role-win',
                parent: self.dto
            }
        }, {
            text: '授权',
            hidden: !interfaceIdSet.has('postRes'),
            iconCls: 'Checkerror',
            doAction: 'show',
            dto: {
                actionType: 'assign',
                winXtype: 'sys-auth_role_res-win',
                parent: self.dto
            }
        }, {
            text: '详情',
            hidden: !interfaceIdSet.has('getRes'),
            iconCls: 'Outline',
            doAction: 'show',
            dto: {
                actionType: '',
                winXtype: 'sys-auth_role_res-win',
                parent: self.dto
            }
        }];

        self.callParent(arguments);
    }
});

