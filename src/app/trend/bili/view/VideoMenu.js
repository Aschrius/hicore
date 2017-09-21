Ext.define('Tool.trend.bili.view.VideoMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.trend-bili_video-menu',
    id: 'trend-bili_video-menu',
    initComponent: function () {
        let me = this;
        me.style = {
            overflow: 'visible'
        };
        me.items = [{
            text: '解析',
            iconCls: 'Outline',
            doAction: 'doReAnalyzeVideo',
            doActionParams: {
                showType: '',
                winXtype: 'system-auth_user_res-win',
                menuXtype: 'system-auth_user-menu'
            }
        }];

        me.callParent(arguments);
    }
});

