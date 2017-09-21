Ext.define('Tool.trend.bili.view.RankUserWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_rank_user-win',
    id: 'trend-bili_rank_user-win',
    dto: {
        actionType: '',
        record: null,
    },
    initComponent: function () {
        let me = this;
        me.layout = 'fit';
        me.title = "榜单授权用户";
        me.iconCls = 'Group';


        me.modal = true;
        me.resizable = false;
        me.height = 300;
        me.width = 400;
        me.items = [
            {
                xtype: 'grid',
                border: false,
                store: 'Tool.trend.bili.store.RankUserStore',
                columns: [{
                    xtype: 'rownumberer',
                    flex: 1
                }, {
                    text: '',
                    dataIndex: 'pic',
                    flex: 1,
                    renderer: function (value) {
                        return '<img style="width: 20px;" src="' + value + '">';
                    }
                }, {
                    text: '名称',
                    dataIndex: 'username',
                    flex: 3
                }, {
                    xtype: 'checkcolumn',
                    text: '运营组',
                    width: 60,
                    dataIndex: 'type_1',

                }, {
                    xtype: 'checkcolumn',
                    text: '收录组',
                    dataIndex: 'type_2',
                    width: 60,
                }, {
                    xtype: 'checkcolumn',
                    text: '视频组',
                    dataIndex: 'type_3',
                    width: 60,
                }],
                dockedItems: [{
                    xtype: 'pagingtoolbar',
                    dock: 'bottom',
                    displayInfo: true,
                    store: 'Tool.trend.bili.store.RankUserStore',
                }]
            }, {
                xtype: 'form',
                items: [{
                    fieldLabel: 'id',
                    name: 'id',

                }],
                hidden: true
            },

        ];

        me.callParent(arguments);
    }
});