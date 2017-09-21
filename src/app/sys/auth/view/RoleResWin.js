Ext.define('Tool.sys.auth.view.RoleResWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.sys-auth_role_res-win',
    id: 'sys-auth_role_res-win',
    dto: {
        actionType: '',// 0.详情,1.授权树
        record: null,
    },
    initComponent: function () {
        let me = this;
        me.layout = 'fit';
        let iconCls = 'Vcard';
        if (me.dto.actionType == 'assign') {
            me.title = "资源树授权";
            me.iconCls = 'Checkerror';
        } else {
            me.title = "资源树详情";
            me.iconCls = 'Outline';
        }


        me.modal = true;
        me.resizable = false;
        me.height = 300;
        me.width = 400;
        me.items = [
            {
                xtype: 'treepanel',
                animate: true,
                rootVisible: true,
                expanded: false,
                store: 'Tool.sys.auth.store.RoleResStore',
                scrollable: true,
                height: me.height,
                width: me.width,
                border: false,
                tbar: [{
                    iconCls: 'Reload',
                    xtype: 'button',
                    text: '重载',
                    doAction: 'initResTree'
                }],
                buttons: [{
                    text: '授权',
                    doAction: 'doAssignRes',
                    hidden: me.dto.actionType != 'assign'
                }]

            }, {
                xtype: 'form',
                items: [{
                    fieldLabel: 'id',
                    name: 'id'
                }],
                hidden: true
            },

        ];

        me.callParent(arguments);
    }
});