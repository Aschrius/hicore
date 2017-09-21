Ext.define('Tool.sys.auth.view.RoleWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.sys-auth_role-win',
    id: 'sys-auth_role-win',
    dto: {
        actionType: 0,// 查:0增1,改2,删-1
    },
    initComponent: function () {

        let me = this;

        let iconCls = 'Vcard';
        if (me.showType == 1) {
            iconCls = 'Vcardadd';
        } else if (me.showType == 2) {
            iconCls = 'Vcardedit';
        } else if (me.showType == -1) {
            iconCls = 'Vcarddelete';
        } else {
            iconCls = 'Vcard';
        }


        me.title = '<span style="font-weight: bold;">角色信息</span>';
        me.resizable = false;
        me.modal = true;
        me.iconCls = iconCls;
        me.items = [{
            xtype: 'form',
            defaultType: 'textfield',
            defaults: {
                labelAlign: 'right',
                labelWidth: 30,
                margin: '5 5 5 5'
            },
            items: [{
                fieldLabel: 'id',
                name: 'id',
                hidden: true

            }, {
                fieldLabel: '名称',
                name: 'name',
                readOnly: me.dto.actionType == 0,
                allowBlank: false
            }, {
                fieldLabel: '备注',
                name: 'description',
                readOnly: me.dto.actionType == 0,
                allowBlank: false
            }]
        }];

        me.buttons = [{
            text: '改',
            doAction: 'doModify',
            hidden: me.dto.actionType != 2
        }, {
            text: '增',
            doAction: 'doAdd',
            hidden: me.dto.actionType != 1
        }];


        me.callParent(arguments);
    }
});