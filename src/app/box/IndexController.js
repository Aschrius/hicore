"use strict";

Ext.define('Tool.box.IndexController', {
    extend: 'Tool.base.controller.MvcController',
    statics: {},
    controllers: [
    ],
    views: [
        'Tool.box.IndexPan'
    ],
    stores: [],
    models: [],
    requires: [
        'Tool.base.util.ExtUtil',
    ],
    init: function () {
        let me = this;
        this.initEvent();
        this.initCache();
    },
    initCache: function () {

    },
    initEvent: function () {
        let me = this;
        me.control({
            'box-index-pan': {
                afterrender: me.initView
            },
            'box-index-pan component[doAction]': {click: me.doAction},
            'box-pixiv_login-win component[doAction]': {click: me.doAction},
        });
    },
    initView: function () {
        this.updateLoginPixivUI();
    },
    showLoginPixiv: function (view) {
        Ext.widget('box-pixiv_login-win').show(view);
    },
    confirmLoginPixiv: async function () {
        let me = this;
        try {
            let webview = document.getElementById('box-pixiv_login-webview');
            let cookie = await ElectronUtil.executeJavaScript(webview, 'document.cookie')
            let user = await ElectronUtil.executeJavaScript(webview, 'pixiv.user');
            console.log(cookie);
            console.log(user)
            if (user.loggedIn == true) {
                let avatar = await ElectronUtil.executeJavaScript(webview, 'jQuery(".user-image")[0].src');
                let name = await ElectronUtil.executeJavaScript(webview, 'jQuery("h1.user").html()');

                ExtUtil.showTip('登入成功');
                localStorage.setItem('box-pixiv-login', JSON.stringify({
                    id: user.id,
                    name: name,
                    avatar: avatar,
                    cookie: cookie
                }));

                let win = Ext.ComponentQuery.query('box-pixiv_login-win')[0];
                win.close();


            } else {
                ExtUtil.showTip('没登入？再试试？');
                localStorage.removeItem('box-pixiv-login');
            }

            me.updateLoginPixivUI();

        } catch (e) {
            console.error(e);
        }
    },
    updateLoginPixivUI: function () {
        // 哔哩哔哩
        try {
            let loginInfo = localStorage.getItem('box-pixiv-login');
            let pan = Ext.ComponentQuery.query('box-index-pan')[0];
            let avatar = __dirname + '/box/pixiv/res/pixiv.ico';
            let name = '';
            let id = '未登入';
            if (loginInfo != null) {
                loginInfo = JSON.parse(loginInfo);
                avatar = loginInfo.avatar
                name = loginInfo.name;
                id = loginInfo.id;
                let cookie = loginInfo.cookie;

                try {
                    // AT.ipcRenderer.send('change-Cookie', {
                    //     Cookie: cookie,
                    //     urls: ['*//*.pixiv.net/*']
                    // });
                } catch (e) {
                    console.error(e);
                }
            }
            pan.down('box[action=facePixiv]').getEl().dom.src = avatar;
            pan.down('label[action=infoPixiv]').setText(name + '(' + id + ')');


        } catch (e) {
            console.error(e);
        }
    },


});
