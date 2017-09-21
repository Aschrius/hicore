"use strict";
Ext.define('Tool.base.controller.MvcController', {
    extend: 'Ext.app.Controller',
    statics: {
        app: 'mvc',
        indexButtons: []
    },
    id: 'baseMvcController',
    requires: [],
    views: [
        'Tool.base.view.MvcView',
        'Tool.base.view.TipWin',
        'Tool.base.view.ShellView',
        'Tool.base.ux.DateTimeField',
        'Tool.base.ux.DateTimePicker',
    ],
    viewStack: [],
    viewBackFlag: false,
    initCache: function () {


    },
    init: function () {
        this.initEvent();
        this.initCache();
    },
    initEvent: function () {
        let me = this;
        this.control({
            'mvcview component[toTarget]': {click: me.toTarget},
            'mvcview component[toBack]': {click: me.toBack},
            'mvcview component[toWin]': {click: me.toWin},
            'mvcview component[toSubsys]': {click: me.toSubsys},
            'mvcview component[toModule]': {click: me.toModule},
            'mvcview component[toRoute=true]': {click: me.toRoute}
        });
    },
    logger: function (msg) {
        let me = this;
        console.info(new Date() + ' - ' + me._moduleClassName);
        console.log(msg)
    },
    /**
     * component_ 必须含有 doActionParams,fn(dto,data)
     * dto 默认入component中的record等对象,data 为要填充form的对象
     */
    beforeShowWin: function (component, beforeShowFn) {
        let fn = beforeShowFn;

        let dto = component.dto;
        dto = typeof(dto) != 'undefined' ? dto : {};
        if (typeof (dto.beforeShowFn) == 'function') {
            fn = dto.beforeShowFn;
        }


        let win = Ext.widget(dto.winXtype, {dto: dto});

        let menu = component.up('menu');
        let data = null;
        if (typeof (menu) != 'undefined' && menu != null) {
            dto.parent = menu.dto;
            let record = dto.parent.record;
            data = record.getData();
        }
        if (typeof fn == 'function') {
            data = fn(win, dto, data);
        }
        if (dto.actionType != 1) {
            let form = win.down('form').getForm();
            form.reset();
            form.setValues(data);
        }
        return win;
    },
    /**
     * store 的 menu
     */
    beforeShowMenu: function (component, record, menuXtype) {

        let menus = Ext.ComponentQuery.query('menu');
        if (menus != null) {
            for (let i = 0; i < menus.length; i++)
                menus[i].close();
        }
        let store = null;
        if (typeof(component.up('treepanel')) != 'undefined' && component.up('treepanel') != null) {
            store = component.up('treepanel').getStore();
        } else {
            store = component.up('grid').getStore();
        }

        let menu = Ext.widget(menuXtype, {dto: {record: record, store: store, component: component}});

        return menu;

    },
    verifyWinForm: function (winXtype, recordClass) {
        let win = Ext.ComponentQuery.query(winXtype)[0];
        let form = win.down('form').getForm();
        if (!form.isValid()) {
            throw new Error('参数有误')
        }

        let data = form.getValues();
        let id = data.id == 'undefined' ? null : data.id;
        let record = recordClass.create(data);
        console.log('verifyWinForm(pre):id=' + record.get('id'));
        record.set('id', id);
        console.log('verifyWinForm:id=' + record.get('id'));

        // let proxy = record.getProxy();
        // Ext.apply(proxy.extraParams, {
        //     id: record.get('id')
        // });

        if (!record.isValid()) {
            throw new Error('参数有误，验证不通过')
        }
        return {
            record: record,
            win: win,
            form: form
        };

    },
    doAction: function (component) {
        let me = this;
        if (typeof(me[component.doAction]) == 'undefined') {
            ExtUtil.showTip('好像什么事情都没有发生');
            console.log('button func not found : ' + component.doAction);
            return;
        }
        try {
            me[component.doAction](component);
        } catch (e) {
            console.error(e);
            Ext.MessageBox.show({
                title: 'Error',
                msg: '<span style="color:red;font-weight: bold;">' + e.message + '</span>',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });

        }

    },
    // toRoute: function (component_, e, eOpts) {
    //     let me = this;
    //     if (typeof (component_.toTarget) != 'undefined' && component_.toTarget != null) {
    //         me.toTarget(component_);
    //
    //     } else if (typeof (component_.toBack) != 'undefined' && component_.toBack != null) {
    //         me.toBack(component_);
    //
    //     } else if (typeof (component_.toWin) != 'undefined' && component_.toWin != null) {
    //         me.toWin(component_);
    //     } else {
    //         ExtUtil.showTip('配置有误');
    //     }
    // },
    toTarget: function (button) {
        let tabpanel = Ext.ComponentQuery.query('mvcview tabpanel')[0];
        ExtUtil.addNewTabpanel(tabpanel, button.toTarget);

    },
    toBack: function (button) {
        let tabpanel = Ext.ComponentQuery.query('mvcview tabpanel')[0];
        tabpanel.setActiveTab(button.toBack);

    },
    /**
     * 1.component == 普通
     *   win.dto = component.dto
     * 2.component == menuitem
     *   win.dto = component.dto
     *      dto = {record,actionType}
     *
     * @param component
     * @returns {Promise.<void>}
     */
    toWin: async function (component) {
        //TODO 这里需要拓展
        let wins = Ext.ComponentQuery.query(component.toWin);
        if (Number.isInteger(wins.length)) {
            for (let i = 0; i < wins.length; i++) {
                wins[i].close();
            }
        }

        let dto = {};
        if (typeof component.fn == 'function') {
            await component.fn(component.dto);
            dto = component.dto;
        }

        // 默认填充form
        let data = {};
        if (component.dto != null && component.dto.record != null) {
            data = component.dto.record.getData();
        }
        let win = Ext.widget(component.toWin, {dto: dto});

        let form = win.down('form');
        if (form != null) {
            form = form.getForm();
            form.reset();
            form.setValues(data);
        }

        win.show(component);
    },
    toSubsys: function (button) {

        let tabpanel = Ext.ComponentQuery.query('mvcview tabpanel')[0];
        tabpanel.removeAll();

        let pan = Ext.widget(button.toSubsys);
        tabpanel.add(pan);
        tabpanel.setActiveTab(pan.id);
    },
    toModule: function (component) {
        let self = this;

        // 动态加载模块的controller
        let moduleControllerName = component.dto.controller;
        let app = Tool.getApplication();
        let isLoad = false;
        try {
            eval(moduleControllerName);
            eval('isLoad = null!=' + moduleControllerName);
        } catch (e) {
        }
        if (!isLoad) {
            Ext.require(moduleControllerName, function () {
                app.getController(moduleControllerName);
                self._add2tabpanel(component);
            }, self);
        } else {
            self._add2tabpanel(component);
        }
    },
    _add2tabpanel(component) {
        let tabpanel = Ext.ComponentQuery.query('mvcview tabpanel')[0];
        try {
            if (component.dto.useCache == false) {
                ExtUtil.addNewTabpanel(tabpanel, component.toModule, component.dto);
            } else {
                ExtUtil.addOrActiveTabpanel(tabpanel, component.toModule, component.dto);
            }
        } catch (e) {
            ExtUtil.addOrActiveTabpanel(tabpanel, component.toModule, component.dto);
        }
    }
});
