Ext.define('Tool.trend.bili.view.RankRuleMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.trend-bili_rank_rule-menu',
    id: 'trend-bili_rank_rule-menu',
    initComponent: function () {
        let me = this;
        me.style = {
            overflow: 'visible'
        };
        me.items = [{
            text: '<span style="color:green;">增</span>',
            iconCls: 'Vcardadd',
            doAction: 'show',
            dto: {
                actionType: 1,
                winXtype: 'trend-bili_rank_rule-win',
            }
        }, "-", {
            text: '删',
            iconCls: 'Vcarddelete',
            doAction: 'doRuleDelete',
        }, '-', {
            text: '改',
            iconCls: 'Vcardedit',
            doAction: 'show',
            dto: {
                actionType: 2,
                winXtype: 'trend-bili_rank_rule-win',
            }
        }, "-", {
            text: '查',
            iconCls: 'Vcard',
            doAction: 'show',
            dto: {
                actionType: 0,
                winXtype: 'trend-bili_rank_rule-win',
            }
        }, '-', {
            text: '新增模块',
            iconCls: 'Outline',
            doAction: 'show',
            dto: {
                actionType: 1,
                winXtype: 'trend-bili_rank_rule_filter-win',
            }
        }];

        me.callParent(arguments);
    }
});

