Ext.define('Tool.sys.auth.view.ResMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.sys-auth_res-menu',
    id: 'sys-auth_res-menu',
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
            dto: {
                actionType: 1,
                winXtype: 'sys-auth_res-win'
            },
            hidden: !interfaceIdSet.has('post'),
            iconCls: 'Vcardadd',
            doAction: 'showAdd'
        }, {
            text: '<span style="color:red;">删</span>',
            hidden: !interfaceIdSet.has('delete'),
            iconCls: 'Vcarddelete',
            doAction: 'doDel'
        }, {
            text: '改',
            hidden: !interfaceIdSet.has('put'),
            dto: {
                actionType: 2,
                winXtype: 'sys-auth_res-win'
            },
            iconCls: 'Vcardedit',
            doAction: 'show'
        }, {
            text: '查',
            hidden: !interfaceIdSet.has('getChildren'),
            dto: {
                actionType: 0,
                winXtype: 'sys-auth_res-win'
            },
            iconCls: 'Vcard',
            doAction: 'show'
        }];

        self.callParent(arguments);
    }
});

