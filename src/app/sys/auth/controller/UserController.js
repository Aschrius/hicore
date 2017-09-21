"use strict";
Ext.define('Tool.sys.auth.controller.UserController', {
    extend: 'Tool.base.controller.MvcController',
    statics: {},
    views: [
        'Tool.sys.auth.view.UserPan',
        'Tool.sys.auth.view.UserMenu',
        'Tool.sys.auth.view.UserWin',
        'Tool.sys.auth.view.UserRoleWin',
        'Tool.sys.auth.view.UserResWin',
    ],
    stores: [
        'Tool.sys.auth.store.UserStore',
        'Tool.sys.auth.store.UserRoleStore',
        'Tool.sys.auth.store.UserResStore',
    ],
    models: [
        'Tool.sys.auth.model.UserModel',
        'Tool.sys.auth.model.UserRoleModel',
        'Tool.sys.auth.model.UserResModel',
        'Tool.sys.auth.model.UserResBatchModel',
    ],
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        let me = this;
        me.control({
            /*** 配置通用action ***/
            'sys-auth_user-pan button[doAction]': {click: me.doAction},
            'sys-auth_user-win button[doAction]': {click: me.doAction},
            'sys-auth_user-menu menuitem[doAction]': {click: me.doAction},
            /*** 配置通用action-end ***/
            'sys-auth_user-pan grid': {itemcontextmenu: me.showMenu},
            'sys-auth_user-pan': {
                afterrender: me.initGrid
            },
            'sys-auth_user_role-win grid': {afterrender: me.initRoleGrid},
            'sys-auth_user_role-win grid checkcolumn': {checkchange: me.doAssignRole},
            'sys-auth_user_res-win button[doAction]': {click: me.doAction},
            'sys-auth_user_res-win treepanel': {afterrender: me.initResTree, checkchange: me.doChangeTreeState},

        });

    },
    /*** 角色表初始化 ***/
    initGrid: function () {
        let grid = Ext.ComponentQuery.query('sys-auth_user-pan grid')[0];
        let store = grid.getStore();
        store.load();
    },
    /*** 展示角色(通用) ***/
    show: function (component) {
        let win = this.beforeShowWin(component, function (win, dto, data) {

            if (win.getXType() == 'sys-auth_user-win') {
                let radiogroup = win.down('form').child('radiogroup[action=status]');
                radiogroup.setValue({
                    status: data.status
                });

            }
            return data;

        });
        win.show(component);
    },

    /*** 展示右键目录 ***/
    showMenu: function (component_, record, item, index, e, eOpts) {
        e.preventDefault();
        let menu = this.beforeShowMenu(component_, record, 'sys-auth_user-menu');
        menu.showAt(e.getXY());

    },
    /*** 添加资源 ***/
    doAdd: function () {
        let me = this;
        let {record, win, form} = me.verifyWinForm('sys-auth_user-win', Tool.sys.auth.model.UserModel);

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
        let menu = component_.up('sys-auth_user-menu');
        let record = menu.dto.record;
        let store = menu.dto.store;

        Ext.MessageBox.confirm('提示', '<strong>将删除<span style="color: red;font-weight: bold">[ ' + record.get('username') + ' ]</span>，此操作不可恢复</strong>', function (buttonId) {
            if (buttonId != 'yes') return;

            let id = record.get('id');
            new Tool.sys.auth.model.UserModel({id: id}).erase({
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
        let {record, win, form} = me.verifyWinForm('sys-auth_user-win', Tool.sys.auth.model.UserModel);
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
    /*** 初始化角色 ***/
    initRoleGrid: function () {
        let win = Ext.ComponentQuery.query('sys-auth_user_role-win')[0];
        let grid = win.down('grid');
        let gridStore = grid.getStore();
        let {record, store, showType} = win.dto.parent;

        Ext.apply(gridStore.proxy.extraParams, {
            userId: record.get('id')
        });

        gridStore.reload({
            scope: this,
            callback: function (records, operation, success) {
            }
        });
    },
    /*** 授权角色 ***/
    doAssignRole: function (view, rowIndex, checked, eOpts) {
        let win = Ext.ComponentQuery.query('sys-auth_user_role-win')[0];
        let userRecord = win.dto.parent.record;
        let grid = win.down('grid');
        let gridStore = grid.getStore();

        let record = gridStore.getAt(rowIndex);
        Ext.apply(record.getProxy().extraParams, {userId: userRecord.get('id')});
        record.phantom = true;// 强制新建
        record.save({
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');
                record.commit();
            },
            callback: function (record, operation, success) {
            }
        });

    },
    /*** 展现资源树 ***/
    initResTree: function () {
        let win = Ext.ComponentQuery.query('sys-auth_user_res-win')[0];
        let treepanel = win.down('treepanel');
        let treeStore = treepanel.getStore();
        let {record, store} = win.dto.parent;

        Ext.apply(treeStore.proxy.extraParams, {
            type: win.dto.actionType,
            userId: record.get('id')
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
        let win = Ext.ComponentQuery.query('sys-auth_user_res-win')[0];
        win.mask('祈祷中');
        let treepanel = win.down('treepanel');
        let treeStore = treepanel.getStore();
        let {record, store} = win.dto.parent;

        let nodeList = treepanel.getChecked();
        let ids = [1];
        let i;
        for (i = 0; i < nodeList.length; i++) {
            ids.push(nodeList[i].get('id'));
        }


        let model = new Tool.sys.auth.model.UserResBatchModel({
            method: 'create',
            data: ids
        });
        model.set('id', null);
        let proxy = model.getProxy();
        Ext.apply(proxy.extraParams, {
            userId: record.get('id')
        });
        model.save({
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