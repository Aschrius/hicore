Ext.define('Tool.base.view.LoginWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.base-login-win',
    id: 'base-login-win',
    requires: [],
    initComponent: function () {
        let me = this;
        me.title = '<div align="center">平台登入</div>';
        me.resizable = false;
        me.modal = true;
        me.maximizable = true;
        me.closable = true;
        me.maximized = false;
        me.width = 300;
        me.height = 400;
        me.layout = 'fit';
        me.items = {
            id: 'get',
            xtype: 'form',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'textfield',
                labelAlign: 'top',
                padding: 5
            },
            items: [
                {
                    name: 'id',
                    fieldLabel: '编号'
                },
                {
                    name: 'email',
                    fieldLabel: '邮箱'
                },
                {
                    name: 'password',
                    fieldLabel: '密钥'
                },
                {
                    fieldLabel: '授权',
                    name: 'token',
                    xtype: 'textarea',
                    flex: 1,
                    editable: true,
                }

            ],
            buttonAlign: 'center',
            buttons: [
                {
                    text: '获取',
                    doAction: 'doGet',
                }, {
                    text: '验证',
                    doAction: 'doVerify',
                }
            ]
        };


        me.callParent(arguments);
    }
});
