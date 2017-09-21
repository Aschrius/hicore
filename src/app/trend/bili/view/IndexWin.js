Ext.define('Tool.trend.bili.view.IndexWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_index-win',
    id: 'trend-bili_index-win',
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


        me.title = '<span style="font-weight: bold;">期刊信息</span>';
        me.resizable = false;
        me.modal = true;
        me.iconCls = iconCls;
        me.items = [{
            xtype: 'form',
            defaultType: 'textfield',
            defaults: {
                labelAlign: 'right',
                labelWidth: 100,
                margin: '5 5 5 5'
            },
            items: [
                {
                    fieldLabel: '编号',
                    name: 'id',
                    readOnly: true,
                }, {
                    fieldLabel: '旧-截止时间',
                    name: 'oldDate',
                    readOnly: true,
                    allowBlank: false
                }, {
                    fieldLabel: '新-截止时间',
                    name: 'newDate',
                    readOnly: true,
                    allowBlank: false
                }
            ]
        }];

        me.buttons = [{
            text: '确定',
            doAction: 'doAdd',
            hidden: me.dto.actionType != 1
        }];


        me.callParent(arguments);
    }
});