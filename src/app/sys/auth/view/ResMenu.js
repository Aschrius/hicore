Ext.define('Tool.sys.auth.view.ResMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.sys-auth_res-menu',
    id: 'sys-auth_res-menu',
    initComponent: function () {
        var me = this;
        me.style = {
            overflow: 'visible'
        };
        me.items = [{
            text: '<span style="color:green;">增</span>',
            dto: {
                actionType: 1,
                winXtype: 'sys-auth_res-win'
            },
            iconCls: 'Vcardadd',
            doAction: 'showAdd'
        }, "-", {
            text: '<span style="color:red;">删</span>',
            iconCls: 'Vcarddelete',
            doAction: 'doDel'
        }, "-", {
            text: '改',
            dto: {
                actionType: 2,
                winXtype: 'sys-auth_res-win'
            },
            iconCls: 'Vcardedit',
            doAction: 'show'
        }, "-", {
            text: '查',
            dto: {
                actionType: 0,
                winXtype: 'sys-auth_res-win'
            },
            iconCls: 'Vcard',
            doAction: 'show'
        }];

        me.callParent(arguments);
    }
});

