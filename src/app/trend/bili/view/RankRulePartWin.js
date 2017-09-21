Ext.define('Tool.trend.bili.view.RankRulePartWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_rank_rule_part-win',
    id: 'trend-bili_rank_rule_part-win',
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


        me.title = '<span style="font-weight: bold;">制作信息</span>';
        me.resizable = false;
        me.modal = true;
        me.iconCls = iconCls;
        me.width = 300;
        me.maximized = true;
        me.border = false;
        me.bodyBorder = false;
        me.layout = 'fit';

        me.items = [{
            xtype: 'form',
            border: false,
            bodyBorder: false,
            padding: 10,
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            defaults: {
                xtype: 'textfield',
                labelAlign: 'right',
                anchor: '100%',
                readOnly: me.dto.actionType == 0,
                labelWidth: 40,
                margin: '5 5 5 5',
            },
            items: [
                {
                    fieldLabel: 'id',
                    name: 'id',
                    hidden: true,
                }, {
                    fieldLabel: '名称',
                    name: 'name',
                    emptyText: '综合',
                    allowBlank: false

                }, {
                    fieldLabel: 'pickUp',
                    name: 'pickUp',
                    allowBlank: false
                }, {
                    fieldLabel: 'rankId',
                    name: 'rankId',
                    allowBlank: false
                }, {
                    fieldLabel: 'resultFlag',
                    name: 'resultFlag',
                    allowBlank: false
                }, {
                    fieldLabel: 'resultMarkStatus',
                    name: 'resultMarkStatus',
                    allowBlank: false
                }, {
                    fieldLabel: 'resultSort',
                    name: 'resultSort',
                    allowBlank: false
                }, {
                    fieldLabel: 'resultStatus',
                    name: 'resultStatus',
                    allowBlank: false
                }, {
                    fieldLabel: 'resultOffset',
                    name: 'resultOffset',
                    allowBlank: false
                }, {
                    fieldLabel: 'resultSize',
                    name: 'resultSize',
                    allowBlank: false
                }, {
                    fieldLabel: 'avsLength',
                    name: 'avsLength',
                    allowBlank: false
                }, {
                    fieldLabel: 'avsPause',
                    name: 'avsPause',
                    allowBlank: false
                }, {
                    fieldLabel: 'avsTop',
                    name: 'avsTop',
                    allowBlank: false
                }, {
                    fieldLabel: 'avsType',
                    name: 'avsType',
                    allowBlank: false
                }, {
                    fieldLabel: 'ruleId',
                    name: 'ruleId',
                    allowBlank: false
                }, {
                    fieldLabel: '简介',
                    xtype: 'textareafield',
                    grow: false,
                    name: 'description',
                    allowBlank: false
                }
            ]
        }]
        ;

        me.buttons = [{
            text: '改',
            doAction: 'doPartModify',
            hidden: me.dto.actionType != 2
        }, {
            text: '增',
            doAction: 'doPartAdd',
            hidden: me.dto.actionType != 1
        }];


        me.callParent(arguments);
    }
});