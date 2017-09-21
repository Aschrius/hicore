Ext.define('Tool.sys.auth.view.UserWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.sys-auth_user-win',
    id: 'sys-auth_user-win',
    dto: {
        actionType: 0,// 查:0增1,改2,删-1
    },
    initComponent: function () {

        let me = this;

        let iconCls = 'Vcard';
        if (me.dto.actionType == 1) {
            iconCls = 'Vcardadd';
        } else if (me.dto.actionType == 2) {
            iconCls = 'Vcardedit';
        } else if (me.dto.actionType == -1) {
            iconCls = 'Vcarddelete';
        } else {
            iconCls = 'Vcard';
        }


        me.title = '<span style="font-weight: bold;">用户信息</span>';
        me.resizable = false;
        me.modal = true;
        me.iconCls = iconCls;
        me.width = 300;
        me.border = false;
        me.bodyBorder = false;

        me.items = [{
            xtype: 'form',
            border: false,
            bodyBorder: false,
            padding: 10,
            defaultType: 'textfield',
            defaults: {
                labelAlign: 'right',
                width: '90%',
                labelWidth: 40,
                margin: '5 5 5 5',
            },
            items: [{
                fieldLabel: 'id',
                name: 'id',
                hidden: true,

            }, {
                fieldLabel: '名称',
                name: 'username',
                readOnly: me.dto.actionType == 0,
                allowBlank: false

            }, {
                fieldLabel: 'email',
                name: 'email',
                vtype: 'email',
                readOnly: me.dto.actionType == 0,
                allowBlank: false
            }, {
                xtype: 'radiogroup',
                action: 'status',
                fieldLabel: 'status',
                items: [
                    {boxLabel: '禁用', name: 'status', inputValue: -1, readOnly: me.dto.actionType == 0},
                    {boxLabel: '初始化', name: 'status', inputValue: 0, readOnly: me.dto.actionType == 0},
                    {boxLabel: '激活', name: 'status', inputValue: 1, readOnly: me.dto.actionType == 0}]
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