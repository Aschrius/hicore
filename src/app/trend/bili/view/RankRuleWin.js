Ext.define('Tool.trend.bili.view.RankRuleWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_rank_rule-win',
    id: 'trend-bili_rank_rule-win',
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


        me.title = '<span style="font-weight: bold;">规则信息</span>';
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
                labelWidth: 60,
                margin: '5 5 5 5',
            },
            items: [
                {
                    fieldLabel: 'id',
                    name: 'id',
                    hidden: true,
                }, {
                    fieldLabel: '版本',
                    name: 'version',
                    readOnly: me.dto.actionType != 1,
                    regex: /^\d+.\d+.\d+$/,
                    regexText: '版本',
                    emptyText: '1.2.3',
                    allowBlank: false

                }, {
                    fieldLabel: '简介',
                    xtype: 'textareafield',
                    grow: false,
                    name: 'description',
                    allowBlank: false

                }, {
                    fieldLabel: '总分排列',
                    name: 'scoreCsvHeader',
                    allowBlank: false,
                    emptyText: 'score,playScore,reScore,favoritesScore'
                }, {
                    fieldLabel: '总分脚本',
                    xtype: 'textareafield',
                    grow: true,
                    name: 'scoreScript',
                    flex: 1,
                    allowBlank: false,
                    emptyText: `function getScore(data,oldRank){
}`
                }, {
                    fieldLabel: '排名脚本',
                    xtype: 'textareafield',
                    grow: true,
                    name: 'resultScript',
                    flex: 1,
                    allowBlank: false,
                    emptyText: `function getResult(scoreVo)
}`
                }
            ]
        }]
        ;

        me.buttons = [{
            text: '改',
            doAction: 'doRuleModify',
            hidden: me.dto.actionType != 2
        }, {
            text: '增',
            doAction: 'doRuleAdd',
            hidden: me.dto.actionType != 1
        }];


        me.callParent(arguments);
    }
});