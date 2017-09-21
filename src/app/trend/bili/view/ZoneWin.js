Ext.define('Tool.trend.bili.view.ZoneWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_zone-win',
    id: 'trend-bili_zone-win',
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


        me.title = '<span style="font-weight: bold;">分区信息</span>';
        me.resizable = false;
        me.modal = true;
        me.iconCls = iconCls;
        me.items = [{
            xtype: 'form',
            defaultType: 'textfield',
            defaults: {
                labelAlign: 'right',
                labelWidth: 50,
                margin: '5 5 5 5'
            },
            items: [{
                fieldLabel: 'id',
                xtype: 'numberfield',
                name: 'id',
                readOnly: me.dto.actionType == 0 || me.dto.actionType == 2,
                allowBlank: false

            }, {
                fieldLabel: '名称',
                name: 'name',
                readOnly: me.dto.actionType == 0,
                allowBlank: false
            }, {
                xtype: 'radiogroup',
                action: 'status',
                fieldLabel: 'status',
                items: [
                    {boxLabel: '禁用', name: 'status', inputValue: -1, readOnly: me.dto.actionType == 0},
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