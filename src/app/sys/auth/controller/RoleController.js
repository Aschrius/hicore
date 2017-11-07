"use strict";
Ext.define('Tool.sys.auth.controller.RoleController', {
    extend: 'Tool.base.controller.MvcController',
    statics: {},
    views: [
        /*** 配置通用view ***/
        'Tool.sys.auth.view.RolePan',
        'Tool.sys.auth.view.RoleMenu',
        'Tool.sys.auth.view.RoleWin',
        /*** 配置通用view-end ***/
        'Tool.sys.auth.view.RoleResWin'
    ],
    stores: [
        'Tool.sys.auth.store.RoleStore',
        'Tool.sys.auth.store.RoleResStore'
    ],
    models: [
        'Tool.sys.auth.model.RoleModel',
        'Tool.sys.auth.model.RoleResBatchModel',
    ],
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        let me = this;
        me.control({
            /*** 配置通用action ***/
            'sys-auth_role-pan button[doAction]': {click: me.doAction},
            'sys-auth_role-menu menuitem[doAction]': {click: me.doAction},
            'sys-auth_role-win button[doAction]': {click: me.doAction},
            /*** 配置通用action-end ***/
            'sys-auth_role-pan': {afterrender: me.initGrid},
            'sys-auth_role-pan grid': {itemcontextmenu: me.showMenu},
            'sys-auth_role_res-win': {beforeshow: me.initResTree},
            'sys-auth_role_res-win button[doAction]': {click: me.doAction},
            'sys-auth_role_res-win treepanel': {checkchange: me.doChangeTreeState},
        });

    },
    /*** 角色表初始化 ***/
    initGrid: function () {
        let grid = Ext.ComponentQuery.query('sys-auth_role-pan grid')[0];
        let store = grid.getStore();
        store.load();
    },
    /*** 展示角色(通用) ***/
    show: function (component_) {
        let win = this.beforeShowWin(component_);
        win.show(component_);
    },

    /*** 展示右键目录 ***/
    showMenu: function (component_, record, item, index, e, eOpts) {
        e.preventDefault();
        let pan = Ext.ComponentQuery.query('sys-auth_role-pan')[0];
        let menu = this.beforeShowMenu(component_, record, 'sys-auth_role-menu', pan.dto);
        menu.showAt(e.getXY());
    },
    /*** 添加资源 ***/
    doAdd: function () {
        let me = this;
        let {record, win, form} = me.verifyWinForm('sys-auth_role-win', Tool.sys.auth.model.RoleModel);
        record.save({
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');
                win.close();
                me.initGrid();
            },
            callback: function (record, operation, success) {
            }
        });
    },
    /*** 删除资源 ***/
    doDel: function (component_) {
        let menu = component_.up('sys-auth_role-menu');
        let record = menu.dto.record;
        let store = menu.dto.store;

        Ext.MessageBox.confirm('提示', '<strong>将删除<span style="color: red;font-weight: bold">[ ' + record.get('name') + ' ]</span>，此操作不可恢复</strong>', function (buttonId) {
            if (buttonId != 'yes') return;

            let id = record.get('id');
            new Tool.sys.auth.model.RoleModel({id: id}).erase({
                success: function (record, operation) {
                    ExtUtil.showTip('操作成功');
                    store.remove(record);
                }
            });
        });
    },
    /*** 修改资源 ***/
    doModify: function () {
        let me = this;
        let {record, win, form} = me.verifyWinForm('sys-auth_role-win', Tool.sys.auth.model.RoleModel);
        record.save({
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');
                win.close();
                me.initGrid();
            },
            callback: function (record, operation, success) {
            }
        });

    },
    /*** 通用方法-end ***/
    /*** 展现资源树 ***/
    initResTree: function () {
        let win = Ext.ComponentQuery.query('sys-auth_role_res-win')[0];
        let treepanel = win.down('treepanel');
        let treeStore = treepanel.getStore();
        let {record, store} = win.dto.parent;

        Ext.apply(treeStore.proxy.extraParams, {
            type: win.dto.actionType,
            roleId: record.get('id')
        });

        let root = treeStore.getRootNode();
        if (root.isExpanded()) {
            treeStore.reload({
                scope: this,
                callback: function (records, operation, success) {
                    treepanel.expandAll();
                }
            });
        } else {
            root.expand();
        }

    },
    /*** 三太树选中 ***/
    doChangeTreeState: function (node, checked, eOpts) {
        ExtUtil.changeTreeState(node, checked, eOpts);
    },
    /*** 资源树授权 ***/
    doAssignRes: function () {
        let win = Ext.ComponentQuery.query('sys-auth_role_res-win')[0];
        win.mask('祈祷中');
        let treepanel = win.down('treepanel');
        let treeStore = treepanel.getStore();
        let {record, store} = win.dto.parent;

        let nodeList = treepanel.getChecked();
        let ids = [1];
        let i;
        for (i = 0; i < nodeList.length; i++) {
            ids.push(nodeList[i].get('id'))
        }

        let batchRecord = new Tool.sys.auth.model.RoleResBatchModel({
            roleId: record.get('id'),
            method: 'create',
            data: ids
        });
        batchRecord.set('id', null);// 新建都需要设置id为0;

        let proxy = batchRecord.getProxy();
        Ext.apply(proxy.extraParams, {
            roleId: record.get('id')
        });
        batchRecord.save({
            failure: function (record, operation) {
                win.unmask();
            },
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');
                win.close();
            },
            callback: function (record, operation, success) {
            }
        });

    },


});