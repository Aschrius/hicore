"use strict";
Ext.define('Tool.trend.IndexController', {
    extend: 'Tool.base.controller.MvcController',
    statics: {},
    controllers: [
        // /*** 制作 **/
        // 'Tool.trend.bili.controller.MarkController',
        // 'Tool.trend.bili.controller.MaterialController',
        // 'Tool.trend.bili.controller.VideoController',
        //
        // /*** 管理 **/
        // 'Tool.trend.bili.controller.RankController',
        // 'Tool.trend.bili.controller.ZoneController',
        // 'Tool.trend.bili.controller.IndexController',
    ],
    views: [
        'Tool.trend.IndexPan',
        'Tool.trend.bili.view.LoginWin'
    ],
    stores: [
        'Tool.trend.bili.store.IndexStatusStore',
        'Tool.trend.bili.store.UserRankStore',
        'Tool.trend.bili.store.RankIndexStore',
    ],
    models: [
        'Tool.base.util.ExtUtil',
        'Tool.base.util_node.FileUtil',
        'Tool.base.util_node.RequestUtil',
        'Tool.base.util_node.ElectronUtil',
        'Tool.base.util_node.ImageUtil',
        'Tool.base.util_node.NedbUtil',
        // 'Tool.base.util_node.LevelDbUtil',
        'Tool.base.util_node.SqliteUtil',
        'Tool.base.ux.DateTimeField',
        'Tool.base.ux.DateTimePicker',
        'Tool.base.ux.BaseRestProxy',
        'Tool.base.ux.HandleProxy',
        'Tool.trend.bili.model.UserRankModel',
    ],
    init: function () {
        let me = this;
        this.initEvent();
        this.initCache();



    },
    initCache: function () {

        try {
            AT.cache.sqlite = {
                trend_bili: SqliteUtil.getConnection(AT.app.path + '/../conf/trend_bili.sqlite')
            };
            AT.cache.nedb = {
                trend_bili: NedbUtil.getConnection(AT.app.path + '/../conf/trend_bili.nedb')
            };

            // AT.cache.leveldb = {
            //     trend_bili: LevelDbUtil.getConnection(AT.app.path + '/../conf/trend_bili.leveldb')
            // };
        } catch (e) {
            console.log(e)
        }

    },
    initEvent: function () {
        let me = this;
        me.control({
            'trend-index-pan': {
                afterrender: me.initView
            },
            'trend-index-pan component[doAction]': {click: me.doAction},
            'trend-bili_login-win component[doAction]': {click: me.doAction},
            'trend-index-pan combobox[name=rank]': {change: me.initIndex}
        });
    },
    initView: function () {
        this.initRank();
        this.updateLoginBilibiliUI();
        // this.updateLoginEylsunUI();
    },
    initRank: function () {
        let userRankStore = Ext.StoreMgr.get('trend-bili_user_rank-store');
        userRankStore.loadPage(1, {
            scope: this,
            callback: function (records, operation, success) {
                let id = userRankStore.getAt(0).get('id');
                Ext.ComponentQuery.query('trend-index-pan combobox[name=rank]')[0].setValue(id);

            }
        });

    },
    initIndex: function () {
        Ext.ComponentQuery.query('trend-index-pan combobox[name=index]')[0].setValue(null);
        let rankId = Ext.ComponentQuery.query('trend-index-pan combobox[name=rank]')[0].getValue();
        let rankIndexstore = Ext.StoreMgr.get('trend-bili_rank_index-store');
        Ext.apply(rankIndexstore.getProxy().extraParams, {
            rankId: rankId
        });
        rankIndexstore.loadPage(1, {
            scope: this,
            callback: function (records, operation, success) {
                if (rankIndexstore.count() == 0) return;
                let id = rankIndexstore.getAt(0).get('id');
                Ext.ComponentQuery.query('trend-index-pan combobox[name=index]')[0].setValue(id);
            }
        });
    },
    showLoginBilibili: function (c) {
        Ext.widget('trend-bili_login-win').show();
    },
    confirmLoginBilibili: function () {
        let me = this;
        let iframe = document.getElementById('trend-bili_login-iframe');

        let isLogin = iframe.contentWindow.sessionStorage.getItem('bili_login_status');
        console.log(isLogin)
        if (/"isLogin":true/.test(isLogin)) {
            ExtUtil.showTip('登入成功');
            let cookie = iframe.contentWindow.document.cookie;

            let login_data = JSON.parse(isLogin);
            let user_data = {
                mid: login_data[3],
                name: login_data[1].uname,
                face: login_data[1].face,
                cookie: cookie
            };

            localStorage.setItem('trend-bili-login', JSON.stringify(user_data));
            let win = Ext.ComponentQuery.query('trend-bili_login-win')[0];
            win.close();

        } else {
            localStorage.removeItem('trend-bili-login');
            ExtUtil.showTip('没登入？再试试？');
        }
        me.updateLoginBilibiliUI();
    },
    updateLoginBilibiliUI: function () {
        // 哔哩哔哩
        try {
            let loginInfo = localStorage.getItem('trend-bili-login');
            let pan = Ext.ComponentQuery.query('trend-index-pan')[0];
            let face = __dirname + '/trend/bili/res/bilibili.png';
            let name = '';
            let mid = '未登入';
            if (loginInfo != null) {
                loginInfo = JSON.parse(loginInfo);
                face = loginInfo.face
                name = loginInfo.name;
                mid = loginInfo.mid;
            }
            pan.down('box[action=faceBili]').getEl().dom.src = face;
            pan.down('label[action=infoBili]').setText(name + '(' + mid + ')');
        } catch (e) {
            console.error(e);
        }
    }

});