"use strict";
Ext.define('Tool.base.controller.IndexController', {
    extend: 'Tool.base.controller.MvcController',
    statics: {},
    requires: [
        'Tool.base.util.ExtUtil'
    ],
    controllers: [
        'Tool.base.controller.LoginController'
    ],
    views: [
        'Tool.base.view.IndexPan',
    ],
    stores: [],
    models: [],
    init: function () {
        let me = this;
        this.initEvent();
        this.initCache();
        this.initView();
    },
    initCache: function () {
    },
    initEvent: function () {
        let me = this;
        me.control({
            'base-index-pan component[doAction]': {click: me.doAction},
        });
    },
    initView: function () {
        this.updateLoginUserUI();
    },
    showLogin: function (c) {
        Ext.widget('base-login-win').show(c);
    },
    updateLoginUserUI: async function () {
        // 获取配置
        try {
            let isVerify = await this.confirmLogin();
            if (isVerify) {
                let pan = Ext.ComponentQuery.query('base-index-pan')[0];
                pan.down('label[action=userInfo]').setText(AT.app.email + '(' + AT.app.id + ')');
            }
        } catch (err) {
            console.error(err);
        }

    },
    confirmLogin: function () {
        let me = this;
        return new Promise(function (resolve, reject) {
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
                    resolve(false);
                },
                success: function (record, operation) {
                    AT.app.time_difference = parseInt(record.get('time'));
                    me.buildSubsystem(record);
                    resolve(true);
                },
                callback: function (record, operation, success) {
                    if (success != true) {
                        me.updateLoginUserUI();
                    }
                }
            });

        });
    },
    buildSubsystem: function (sessionRecord) {
        let ress = sessionRecord.get('res');
        let rootRes = null;
        ress.forEach(function (val) {
            if (val.xtype == null) {
                rootRes = val;
            }
        });
        let subsystemRes = null;
        if (rootRes == null || rootRes.children == null) {
            return;
        }

        rootRes.children.forEach(function (val) {
            if (val.xtype == AT.subsystem) {
                subsystemRes = val;
            }

        });


        if (subsystemRes == null) {
            return;
        }

        let set = new Set();
        let group = [];
        this.anaXtype(subsystemRes, [], group);

        let uiData = {};
        group.forEach(function (ress) {
            console.log(ress)
            // Tool.trend.bili.controller.IndexController
            // 构建controller

            let controllerName = 'Tool';
            let xtype1 = '';
            let xtype2 = '';
            let xtype3 = '';
            for (let i = 0; i < ress.length; i++) {
                let res = ress[i];

                if (res.resTypeId == 1) {
                    xtype1 = res.xtype;
                } else if (res.resTypeId == 4) {
                    break;
                } else if (res.resTypeId == 2) {
                    xtype2 = res.xtype;
                    // 模块
                    if (uiData[xtype2] == null) {
                        uiData[xtype2] = {
                            text: res.text,
                            buttons: []
                        };
                    }
                }


                if (res.resTypeId == 3) {
                    xtype3 = res.xtype;
                    // 菜单
                    controllerName += '.controller';
                    controllerName += '.' + res.xtype.substr(0, 1).toUpperCase() + res.xtype.substr(1);
                    controllerName += 'Controller';

                    if (!set.has(controllerName))
                        uiData[xtype2].buttons.push({
                            icon: __dirname + '/' + xtype1 + '/' + xtype2 + '/res/' + xtype3 + '.png',
                            text: res.text,
                            toModule: xtype1 + '-' + xtype2 + '_' + xtype3 + '-pan',
                            dto: {
                                controller: controllerName,
                                useCache: false
                            }
                        });

                    set.add(controllerName);
                    break;
                } else {
                    controllerName += '.' + res.xtype;
                }
            }
        });
        AT.auth.uiData = uiData;
        if (set.size <= 0) {
            return;
        }
        // 已经确认有权限
        let indexControllerName = 'Tool.' + AT.subsystem + '.IndexController';
        Ext.require(indexControllerName, function (a, b, c) {
            let app = Tool.getApplication();
            let controller = app.getController(indexControllerName);// 加载并初始化了

            // 自动增加
            let tabpanel = Ext.ComponentQuery.query('mvcview tabpanel')[0];
            let pan = Ext.widget(AT.subsystem + '-index-pan');
            tabpanel.add(pan);
            tabpanel.setActiveTab(pan.id);

        }, this);


    },
    anaXtype: function (res, resList, group) {

        if (typeof (res.interfaceIds) != 'undefined' && res.interfaceIds != null) {
            res.interfaceIds.split(',').forEach(function (val) {
                AT.auth.interfaceIdSet.add(val);
            });
        }


        resList = JSON.parse(JSON.stringify(resList));
        let me = this;
        let r = JSON.parse(JSON.stringify(res));
        delete r.children;
        resList.push(r);
        if (res.children == null || res.children.length == 0) {
            // console.log(resList);
            group.push(resList);
        } else {
            for (let i = 0; i < res.children.length; i++) {
                me.anaXtype(res.children[i], resList, group);
            }
        }

    }
});