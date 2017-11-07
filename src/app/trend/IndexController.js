"use strict";
Ext.define('Tool.trend.IndexController', {
    extend: 'Tool.base.controller.MvcController',
    statics: {},
    controllers: [],
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
        this.initRankView();
        let userRankStore = Ext.StoreMgr.get('trend-bili_user_rank-store');
        userRankStore.loadPage(1, {
            scope: this,
            callback: function (records, operation, success) {
                let record = userRankStore.getAt(0);
                if (record == null) return;
                let id = record.get('id');
                Ext.ComponentQuery.query('trend-index-pan combobox[name=rank]')[0].setValue(id);


            }
        });

    },
    initRankView: function () {
        let combobox = Ext.ComponentQuery.query('trend-index-pan combobox[name=rank]')[0];
        let rankId = combobox.getValue();
        let record = combobox.getStore().getById(rankId);

        let pan = Ext.ComponentQuery.query('trend-index-pan')[0];


        let component_mark = pan.down('component[toModule=trend-bili_mark-pan]');
        if (component_mark != null) component_mark.hide();

        let component_index = pan.down('component[toModule=trend-bili_index-pan]');
        if (component_index != null) component_index.hide();

        let component_video = pan.down('component[toModule=trend-bili_video-pan]');
        if (component_video != null) component_video.hide();

        let component_material = pan.down('component[toModule=trend-bili_material-pan]');
        if (component_material != null) component_material.hide();

        let tabpanel = Ext.ComponentQuery.query('mvcview tabpanel')[0];
        Ext.ComponentQuery.query('trend-bili_mark-pan').forEach(function (component) {
            tabpanel.remove(component);
        });
        Ext.ComponentQuery.query('trend-bili_index-pan').forEach(function (component) {
            tabpanel.remove(component);
        });
        Ext.ComponentQuery.query('trend-bili_video-pan').forEach(function (component) {
            tabpanel.remove(component);
        });
        Ext.ComponentQuery.query('trend-bili_material-pan').forEach(function (component) {
            tabpanel.remove(component);
        });


        Ext.ComponentQuery.query('trend-index-pan label[action=哔哩哔哩]')[0].setText('哔哩哔哩');
        if (record != null) {
            let userRankType = record.get('userRankType');
            // 1.master;2.mark;3.vide
            let text = '';
            if (userRankType == 1) {
                component_mark.show();
                component_index.show();
                component_video.show();
                component_material.show();
                text = '运营组';

            } else if (userRankType == 2) {
                component_mark.show();
                component_index.show();
                component_video.show();
                component_material.show();
                text = '收录组';

            } else if (userRankType == 3) {
                component_index.show();
                component_video.show();
                component_material.show();
                text = '视频组';
            }
            Ext.ComponentQuery.query('trend-index-pan label[action=哔哩哔哩]')[0].setText('哔哩哔哩 - ' + text);
        }

    },
    initIndex: function () {

        // 初始化index
        Ext.ComponentQuery.query('trend-index-pan combobox[name=index]')[0].setValue(null);
        let combobox = Ext.ComponentQuery.query('trend-index-pan combobox[name=rank]')[0];
        let rankId = combobox.getValue();
        // 初始化界面显示

        this.initRankView();

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