"use strict";
Ext.define('Tool.base.controller.LoginController', {
    extend: 'Tool.base.controller.MvcController',
    id: 'baseLoginController',
    statics: {
        APP_CONFIG_PATH: AT.app.path + '/../app.yml',
    },
    requires: [
        'Tool.base.ux.BaseRestProxy',
    ],
    views: [
        'Tool.base.view.LoginWin',
    ],
    stores: [
        'Tool.base.store.LoginStore'
    ],
    models: [
        'Tool.base.model.LoginModel'
    ],
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        let me = this;
        this.control({
            'base-login-win button[doAction]': {click: me.doAction},
            'base-login-win': {
                afterrender: me.initWin

            }
        });
    },
    appConfig_view2cache2local: async function () {
        let win = Ext.ComponentQuery.query('base-login-win')[0];
        let form = win.down('form').getForm();
        let values = form.getValues();
        let token = values.token;
        let [appKey, appSecret] = token.split('.');

        AT.app.id = values.id;
        AT.app.email = values.email;
        AT.app.password = values.password;
        AT.app.appKey = appKey;
        AT.app.appSecret = appSecret;

        await this.appConfig_cache2local();
    },
    appConfig_cache2local: async function () {
        let me = this;
        for (let key in AT.app) {
            if (typeof AT.app[key] == 'undefined') {
                delete AT.app[key];
            }
        }
        let content = await FileUtil.json2Yml(AT.app);
        await FileUtil.writeFileAsync(Tool.base.controller.LoginController.APP_CONFIG_PATH, content, 'utf-8');
    },
    appConfig_cache2view: function () {
        let data = {};
        if (AT.app.id != null) {
            data.id = AT.app.id;
        }
        if (AT.app.email != null) {
            data.email = AT.app.email;
        }
        if (AT.app.password != null) {
            data.password = AT.app.password;
        }
        if (AT.app.id != null) {
            data.id = AT.app.id;
        }
        if (AT.app.appKey != null && AT.app.appSecret != null) {
            data.token = AT.app.appKey + '.' + AT.app.appSecret;
        }

        let win = Ext.ComponentQuery.query('base-login-win')[0];
        let form = win.down('form').getForm();
        form.setValues(data);
    },
    appConfig_local2cache: async function () {
        let config = await FileUtil.parseYmlAsync(Tool.base.controller.LoginController.APP_CONFIG_PATH, 'utf-8');
        if (config == null) return;
        AT.app.id = config.id;
        AT.app.email = config.email;
        AT.app.password = config.password;
        AT.app.appKey = config.appKey;
        AT.app.appSecret = config.appSecret;
        if (typeof config.server != 'undefined' && config.server != null) {
            AT.app.server = config.server;
        }

    },
    initWin: async function (win) {
        // alert('initWin')
        this.logger('initWin');
        this.appConfig_cache2view();
    },
    doGet: async function (button) {
        let me = this;
        let win = button.up('window');

        let form = win.down('form').getForm();
        let values = form.getValues();

        let record = Tool.base.model.LoginModel.create();
        let proxy = record.getProxy();
        Ext.apply(proxy.extraParams, {});

        record.phantom = false;
        record.set('id', values.id);
        record.set('email', values.email);
        record.set('password', values.password);
        record.set('time', new Date().getTime());

        win.down('button[doAction=doGet]').setDisabled(true);
        record.save({
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');
                win.down('textfield[name=token]').setDisabled(false);
                delete AT.app.appKey;
                delete AT.app.appSecret;
                AT.app.time_difference = 0;

                me.appConfig_view2cache2local();

            }, callback: function (record, operation, success) {
                win.down('button[doAction=doGet]').setDisabled(false);
            }
        });

    },

    doVerify: async function (button) {

        let me = this;
        await me.appConfig_view2cache2local();

        let record = Tool.base.model.LoginModel.create();
        let proxy = record.getProxy();
        AT.app.time_difference = 0;
        Ext.apply(proxy.extraParams, {
            time: new Date().getTime()
        });
        record.set('id', null);
        record.load({
            scope: this,
            failure: function (record, operation) {
                console.log(record)
            },
            success: function (record, operation) {
                AT.app.time_difference = parseInt(record.get('time'));

                button.up('window').close();
                ExtUtil.showTip('验证成功!')
                let pan = Ext.ComponentQuery.query('base-index-pan')[0];
                pan.down('label[action=userInfo]').setText(AT.app.email + '(' + AT.app.id + ')');

            },
            callback: function (record, operation, success) {
            }
        });


    }

});
