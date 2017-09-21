Ext.define('Tool.box.pixiv.view.LoginWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.box-pixiv_login-win',
    id: 'box-pixiv_login-win',
    initComponent: function () {
        this.title = 'Pixiv登入';
        this.layout = 'fit';
        this.modal = true;
        this.plain = true;
        this.maximizable = true;
        this.buttons = [
            {text: '确定', doAction: 'confirmLoginPixiv'}
        ];
        this.width = document.body.clientWidth * 0.8;
        this.height = document.body.clientHeight * 0.8;
        this.items = {
            xtype: 'container',
            layout: 'fit',
            action: 'c',
            header: false,
            html: '<webview id="box-pixiv_login-webview" src="https://www.pixiv.net/member.php"  autosize="on" style="width:100%;height:100%" disablewebsecurity></webview>',
            border: false
        };
        this.callParent(arguments);
    }
});

