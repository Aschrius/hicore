Ext.define('Tool.trend.bili.view.LoginWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_login-win',
    id: 'trend-bili_login-win',
    initComponent: function () {
        this.title = '哔哩哔哩登入';
        this.layout = 'fit';
        this.modal = true;
        this.plain = true;
        this.maximizable = true;
        this.buttons = [
            {text: '确定', doAction: 'confirmLoginBilibili'}
        ];
        this.width = document.body.clientWidth * 0.8;
        this.height = document.body.clientHeight * 0.8;
        this.items = [
            {
                xtype: 'container',
                action: 'c',
                header: false,
                html: '<iframe id="trend-bili_login-iframe" style="border-top-width: 0px; border-left-width: 0px; border-bottom-width: 0px; border-right-width: 0px" src=http://space.bilibili.com frameborder="0" width="100%"  height="100%"></iframe>',
                border: false
            }
        ];
        this.callParent(arguments);
    }
});

