"use strict";
Ext.define('Tool.sys.auth.controller.ResController', {
    extend: 'Tool.base.controller.MvcController',
    statics: {},
    views: [
        'Tool.sys.auth.view.ResPan',
        'Tool.sys.auth.view.ResMenu',
        'Tool.sys.auth.view.ResWin',
    ],
    stores: [
        'Tool.sys.auth.store.ResTreeStore',
        'Tool.sys.auth.store.ResTypeStore'
    ],
    models: [
        'Tool.sys.auth.model.ResModel',

    ],
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        let me = this;
        me.control({
            /*** 配置通用action ***/
            'sys-auth_res-pan button[doAction]': {click: me.doAction},
            'sys-auth_res-win button[doAction]': {click: me.doAction},
            'sys-auth_res-menu menuitem[doAction]': {click: me.doAction},
            /*** 配置通用action-end ***/
            'sys-auth_res-pan treepanel': {itemcontextmenu: me.showMenu},
            'sys-auth_res-pan': {afterrender: me.initTree}
        });

    },
    /*** 资源树初始化 ***/
    initTree: function () {
        let treepanel = Ext.ComponentQuery.query('sys-auth_res-pan treepanel')[0];
        let store = treepanel.getStore();
        store.load({
            scope: this,
            callback: function (records, operation, success) {
                store.getRoot().expand();
            }
        });

    },
    /*** 展示右键目录 ***/
    showMenu: function (component, record, item, index, e, eOpts) {
        e.preventDefault();
        if (record.get('id') == 1) {
            return;
        }
        let pan = Ext.ComponentQuery.query('sys-auth_res-pan')[0];
        let menu = this.beforeShowMenu(component, record, 'sys-auth_res-menu',pan.dto);
        menu.showAt(e.getXY());

    },

    /*** 展示Window(通用) ***/
    show: function (component) {
        let win = this.beforeShowWin(component);
        win.show(component);
        return win;
    },
    /*** 添加验证 ***/
    showAdd: function (component) {

        let record = component.up('menu').dto.record;
        let resTypeId = record.get('resTypeId');
        let id = record.get('id');
        if (resTypeId == 4) {
            ExtUtil.showTip('禁止建立子条目');
            return;
        } else if (resTypeId == 5) {
            resTypeId = 3;
        } else {
            resTypeId++;
        }

        let win = this.show(component);
        let form = win.down('form').getForm();


        let data = {
            pid: record.get('id'),
            resTypeId: resTypeId
        };
        form.setValues(data);
    },
    /*** 添加资源 ***/
    doAdd: function () {
        let me = this;
        let {record, win, form} = me.verifyWinForm('sys-auth_res-win', Tool.sys.auth.model.ResModel);

        record.save({
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');
                win.close();
                me.initTree();
            },
            callback: function (record, operation, success) {
            }
        });
    },
    /*** 删除资源 ***/
    doDel: function (component) {
        let menu = component.up('sys-auth_res-menu');
        let record = menu.dto.record;
        Ext.MessageBox.confirm('警告', '<strong>将删除<span style="color: red;font-weight: bold">[ ' + record.get('name') + ' ]</span>，此操作不可恢复</strong>', function (buttonId) {
            if (buttonId != 'yes') return;

            new Tool.sys.auth.model.ResModel({id: record.get('id')}).erase({
                success: function (record, operation) {
                    ExtUtil.showTip('操作成功');
                    // 删除
                    let xtype = 'sys-auth_res-pan treepanel';
                    ExtUtil.deleteNode(xtype, record.get('id'));
                },
                callback: function (record, operation, success) {
                }
            });
        });
    },
    /*** 修改资源 ***/
    doModify: function () {
        let me = this;
        let {record, win, form} = me.verifyWinForm('sys-auth_res-win', Tool.sys.auth.model.ResModel);
        record.save({
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');
                win.close();
                me.initTree();
            },
            callback: function (record, operation, success) {
            }
        });

    }
});