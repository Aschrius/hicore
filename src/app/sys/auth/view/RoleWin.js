Ext.define('Tool.sys.auth.view.RoleWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.sys-auth_role-win',
    id: 'sys-auth_role-win',
    dto: {
        actionType: 0,// 查:0增1,改2,删-1
    },
    initComponent: function () {
        let self = this;
        let interfaceIdSet = new Set();
        try {
            console.log('-----------')
            console.log(self.dto)
            console.log(self.dto.parent)
            console.log(self.dto.parent.parent)
            interfaceIdSet = self.dto.parent.parent.interfaceIdSet;
        } catch (e) {
            console.error(e);
        }

        let iconCls = 'Vcard';
        if (self.showType == 1) {
            iconCls = 'Vcardadd';
        } else if (self.showType == 2) {
            iconCls = 'Vcardedit';
        } else if (self.showType == -1) {
            iconCls = 'Vcarddelete';
        } else {
            iconCls = 'Vcard';
        }


        self.title = '<span style="font-weight: bold;">角色信息</span>';
        self.resizable = false;
        self.modal = true;
        self.iconCls = iconCls;
        self.items = [{
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
                readOnly: self.dto.actionType == 0,
                allowBlank: false
            }, {
                fieldLabel: '备注',
                name: 'description',
                readOnly: self.dto.actionType == 0,
                allowBlank: false
            }]
        }];

        self.buttons = [{
            text: '改',
            doAction: 'doModify',
            hidden: self.dto.actionType != 2 && !interfaceIdSet.has('put')
        }, {
            text: '增',
            doAction: 'doAdd',
            hidden: self.dto.actionType != 1 && !interfaceIdSet.has('post')
        }];


        self.callParent(arguments);
    }
});