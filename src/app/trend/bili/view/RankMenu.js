Ext.define('Tool.trend.bili.view.RankMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.trend-bili_rank-menu',
    id: 'trend-bili_rank-menu',
    initComponent: function () {
        var me = this;
        me.style = {
            overflow: 'visible'
        };
        me.items = [{
            text: '<span style="color:green;">增</span>',
            iconCls: 'Vcardadd',
            doAction: 'show',
            dto: {
                actionType: 1,
                winXtype: 'trend-bili_rank-win',
            }
        }, '-', {
            text: '改',
            iconCls: 'Vcardedit',
            doAction: 'show',
            dto: {
                actionType: 2,
                winXtype: 'trend-bili_rank-win',
            }
        }, "-", {
            text: '查',
            iconCls: 'Vcard',
            doAction: 'show',
            dto: {
                actionType: 0,
                winXtype: 'trend-bili_rank-win',
            }
        }, "-", {
            text: '用户',
            iconCls: 'Group',
            doAction: 'show',
            dto: {
                actionType: 1,
                winXtype: 'trend-bili_rank_user-win',
            }
        }];

        me.callParent(arguments);
    }
});

