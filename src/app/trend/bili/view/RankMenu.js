Ext.define('Tool.trend.bili.view.RankMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.trend-bili_rank-menu',
    id: 'trend-bili_rank-menu',
    initComponent: function () {
        let self = this;
        let interfaceIdSet = new Set();
        try {
            if (self.dto.parent.interfaceIdSet != null) interfaceIdSet = self.dto.parent.interfaceIdSet;
        } catch (e) {
        }
        self.style = {
            overflow: 'visible'
        };
        self.items = [{
            text: '<span style="color:green;">增</span>',
            iconCls: 'Vcardadd',
            doAction: 'show',
            hidden: !interfaceIdSet.has('post'),
            dto: {
                actionType: 1,
                winXtype: 'trend-bili_rank-win',
                parent: self.dto
            }
        }, {
            text: '改',
            iconCls: 'Vcardedit',
            doAction: 'show',
            hidden: !interfaceIdSet.has('put'),
            dto: {
                actionType: 2,
                winXtype: 'trend-bili_rank-win',
                parent: self.dto
            }
        }, {
            text: '查',
            hidden: !interfaceIdSet.has('get'),
            iconCls: 'Vcard',
            doAction: 'show',
            dto: {
                actionType: 0,
                winXtype: 'trend-bili_rank-win',
                parent: self.dto
            }
        }, {
            text: '用户',
            hidden: !interfaceIdSet.has('getUser'),
            iconCls: 'Group',
            doAction: 'show',
            dto: {
                actionType: 1,
                winXtype: 'trend-bili_rank_user-win',
                parent: self.dto
            }
        }];

        self.callParent(arguments);
    }
});

