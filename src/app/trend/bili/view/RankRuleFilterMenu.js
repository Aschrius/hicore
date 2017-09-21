Ext.define('Tool.trend.bili.view.RankRuleFilterMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.trend-bili_rank_rule_filter-menu',
    id: 'trend-bili_rank_rule_filter-menu',
    initComponent: function () {
        var me = this;
        me.style = {
            overflow: 'visible'
        };
        me.items = [{
            text: '删',
            iconCls: 'Vcarddelete',
            doAction: 'doFilterDelete',
        }, '-', {
            text: '改',
            iconCls: 'Vcardedit',
            doAction: 'show',
            dto: {
                actionType: 2,
                winXtype: 'trend-bili_rank_rule_filter-win',
            }
        }, "-", {
            text: '查',
            iconCls: 'Vcard',
            doAction: 'show',
            dto: {
                actionType: 0,
                winXtype: 'trend-bili_rank_rule_filter-win',
            }
        }];

        me.callParent(arguments);
    }
});

