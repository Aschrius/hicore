"use strict";
Ext.define('Tool.trend.bili.controller.ZoneController', {
    extend: 'Tool.base.controller.MvcController',
    statics: {},
    views: [
        /*** 配置通用view ***/
        'Tool.trend.bili.view.ZonePan',
        'Tool.trend.bili.view.ZoneMenu',
        'Tool.trend.bili.view.ZoneWin',
        /*** 配置通用view-end ***/
        'Tool.trend.bili.view.ExpCsvGrid',
        'Tool.trend.bili.view.ZoneTagWin',
        'Tool.trend.bili.view.ZoneExpCsvWin',
        'Tool.trend.bili.view.ZoneExpCsvMenu',
        'Tool.trend.bili.view.ZoneTagMenu',
    ],
    stores: [
        'Tool.trend.bili.store.ZoneStore',
        'Tool.trend.bili.store.ZoneTagStore',
        'Tool.trend.bili.store.ZoneTagStatusStore',
        'Tool.trend.bili.store.ZoneExpCsvStore',
        'Tool.trend.bili.store.ExpCsvStatusStore',
    ],
    models: [
        'Tool.trend.bili.model.ZoneModel',
        'Tool.trend.bili.model.ZoneTagModel',
        'Tool.trend.bili.model.ZoneTaskModel',
        'Tool.trend.bili.model.ZoneExpCsvModel',
        'Tool.trend.bili.model.TagTaskModel',
    ],
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        let me = this;
        me.control({
            /*** 配置通用action ***/
            'trend-bili_zone-pan button[doAction]': {click: me.doAction},
            'trend-bili_zone-menu menuitem[doAction]': {click: me.doAction},
            'trend-bili_zone-win button[doAction]': {click: me.doAction},
            /*** 配置通用action-end ***/
            'trend-bili_zone-pan': {afterrender: me.initGrid},

            'trend-bili_zonetag-win grid': {afterrender: me.initTagGrid, itemcontextmenu: me.showTagMenu},
            'trend-bili_zonetag-menu menuitem[doAction]': {click: me.doAction},

            'trend-bili_zone-pan grid': {itemcontextmenu: me.showMenu},
            'trend-bili_zone-win': {beforeshow: me.initResTree},

            'trend-bili_zoneexpcsv-win button[doAction]': {click: me.doAction},
            'trend-bili_zoneexpcsv-win grid': {
                afterrender: me.initExpCsvGrid,
                itemcontextmenu: me.showExpCsvMenu
            },
            'trend-bili_zoneexpcsv-menu menuitem[doAction]': {click: me.doAction},

            'trend-bili_zoneexpcsv-win container[action=new]': {addCsv: me.addCsv, click: me.clearMix},
            'trend-bili_zoneexpcsv-win container[action=old]': {addCsv: me.addCsv, click: me.clearMix},
        });

    },
    /*** 初始化 ***/
    initGrid: function () {
        let grid = Ext.ComponentQuery.query('trend-bili_zone-pan grid')[0];
        let store = grid.getStore();
        store.load();

    },
    initTagGrid: function () {
        let win = Ext.ComponentQuery.query('trend-bili_zonetag-win')[0];
        let record = win.dto.parent.record;
        let grid = win.down('grid');
        let store = grid.getStore();
        Ext.apply(store.getProxy().extraParams, {
            zoneId: record.get('id')
        });
        store.load();
    },
    initExpCsvGrid: function () {
        let win = Ext.ComponentQuery.query('trend-bili_zoneexpcsv-win')[0];
        let record = win.dto.parent.record;
        let grid = win.down('grid');
        let store = grid.getStore();
        Ext.apply(store.getProxy().extraParams, {
            zoneId: record.get('id')
        });
        store.load();
    },
    /*** 展示(通用) ***/
    show: function (component_) {
        let win = this.beforeShowWin(component_);
        win.show(component_);
    },

    /*** 展示右键目录 ***/
    showExpCsvMenu: function (component_, record, item, index, e, eOpts) {
        e.preventDefault();
        let menu = this.beforeShowMenu(component_, record, 'trend-bili_zoneexpcsv-menu');
        menu.showAt(e.getXY());
    },
    showTagMenu: function (component_, record, item, index, e, eOpts) {
        e.preventDefault();
        let menu = this.beforeShowMenu(component_, record, 'trend-bili_zonetag-menu');
        menu.showAt(e.getXY());
    },
    showMenu: function (component_, record, item, index, e, eOpts) {
        e.preventDefault();
        let menu = this.beforeShowMenu(component_, record, 'trend-bili_zone-menu');
        menu.showAt(e.getXY());
    },
    /*** 添加资源 ***/
    doAdd: function () {
        let me = this;
        let {record, win, form} = me.verifyWinForm('trend-bili_zone-win', Tool.trend.bili.model.ZoneModel);
        record.phantom = true;// 新建
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
    doDel: function (component) {
        let menu = component.up('trend-bili_zone-menu');
        let record = menu.dto.record;
        let store = menu.dto.store;

        Ext.MessageBox.confirm('提示', '<strong>将删除<span style="color: red;font-weight: bold">[ ' + record.get('name') + ' ]</span>，此操作不可恢复</strong>', function (buttonId) {
            if (buttonId != 'yes') return;

            let id = record.get('id');
            new Tool.trend.bili.model.ZoneModel({id: id}).erase({
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
        let {record, win, form} = me.verifyWinForm('trend-bili_zone-win', Tool.trend.bili.model.ZoneModel);
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

    /*** 数据采集 ***/
    doCollect: function (component) {
        let me = this;
        let record = component.up('menu').dto.record;
        let task = new Tool.trend.bili.model.ZoneTaskModel({id: null});

        Ext.apply(task.getProxy().extraParams, {
            zoneId: record.get('id')
        });
        task.phantom = true;// 新建
        task.set('id', null);
        task.set('type', 1001);
        task.save({
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');
                win.close();
                me.initGrid();
            },
            callback: function (record, operation, success) {
            }
        });

    },
    reCollect: function (component) {
        let me = this;
        let record = component.up('menu').dto.record;
        let task = new Tool.trend.bili.model.ZoneTaskModel({id: null});

        Ext.apply(task.getProxy().extraParams, {
            zoneId: record.get('zoneId')
        });
        task.phantom = true;// 新建
        task.set('id', null);
        task.set('type', 1001);
        task.set('ext', {tagId: record.get('id')});
        task.save({
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');
                win.close();
                me.initGrid();
            },
            callback: function (record, operation, success) {
            }
        });
    },
    /*** MIX ***/
    clearMix: function (view) {

        let win = Ext.ComponentQuery.query('trend-bili_zoneexpcsv-win')[0];
        let container = null;
        let src = null;
        let flag = '';
        let dater = null;
        if (view.action == 'new') {
            dater = win.down('datefield[action=new]');
            container = win.down('container[action=new]');
            flag = 'new';
        } else {
            dater = win.down('datefield[action=old]');
            container = win.down('container[action=old]');
            flag = 'old';
        }
        container.down('label').setText(flag);
        container.down('box').getEl().dom.src = '';
        container.dto = null;
        dater.setValue(null);


    },
    addCsv: function (view, data) {
        this.clearMix(view);
        let record = data.records[0];

        if (record.get('type') != 'SRC') {
            Ext.MessageBox.show({
                title: 'Error',
                msg: '<span style="color:red;font-weight: bold;">' + '仅SRC' + '</span>',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return;
        }

        let win = Ext.ComponentQuery.query('trend-bili_zoneexpcsv-win')[0];
        let oldContainer = win.down('container[action=old]');
        let newContainer = win.down('container[action=new]');
        let oldDater = win.down('datefield[action=old]');
        let newDater = win.down('datefield[action=new]');

        let dater = null;
        let container = null;
        let src = null;
        if (view.action == 'new') {
            container = newContainer;
            dater = newDater;
            src = 'trend/bili/res/doc_new.png';

            if (typeof(oldContainer.dto) != 'undefined' && oldContainer.dto != null) {
                let oldRecord = oldContainer.dto.record;
                let newRecord = record;
                if (oldRecord.get('batchNo') >= newRecord.get('batchNo')) {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: '<span style="color:red;font-weight: bold;">' + '新旧错乱' + '</span>',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                    return;
                }
            }


        } else {
            container = oldContainer;
            dater = oldDater;
            src = 'trend/bili/res/doc_old.png';

            if (typeof(newContainer.dto) != 'undefined' && newContainer.dto != null) {
                let oldRecord = record;
                let newRecord = newContainer.dto.record;
                if (oldRecord.get('batchNo') >= newRecord.get('batchNo')) {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: '<span style="color:red;font-weight: bold;">' + '新旧错乱' + '</span>',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                    return;
                }
            }
        }
        dater.setValue(new Date(record.get('createDate')));
        container.down('label').setText(record.get('id'));
        container.down('box').getEl().dom.src = src;
        container.dto = {record: record};


    },
    doMix: function () {
        let me = this;
        let win = Ext.ComponentQuery.query('trend-bili_zoneexpcsv-win')[0];
        let zoneRecord = win.dto.parent.record;

        let oldContainer = win.down('container[action=old]');
        let newContainer = win.down('container[action=new]');
        let oldDater = win.down('datefield[action=old]');
        let newDater = win.down('datefield[action=new]');
        if (newContainer.dto == null || oldContainer.dto == null) {
            Ext.MessageBox.show({
                title: 'Error',
                msg: '<span style="color:red;font-weight: bold;">' + '请选择' + '</span>',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return;
        }
        let oldRecord = oldContainer.dto.record;
        let newRecord = newContainer.dto.record;

        let record = Tool.trend.bili.model.ZoneExpCsvModel.create();
        let proxy = record.getProxy();
        Ext.apply(proxy.extraParams, {
            zoneId: zoneRecord.get('id')
        });
        let newData = newDater.getValue().getTime();
        let oldData = oldDater.getValue().getTime();
        record.set('id', undefined);
        record.set('newId', newRecord.get('id'));
        record.set('oldId', oldRecord.get('id'));
        record.set('newDate', newData);
        record.set('oldDate', oldData);
        record.phantom = true;// 新建
        record.save({
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');
                me.initExpCsvGrid();
                // win.close();
            },
            callback: function (record, operation, success) {
            }
        });


    },
    doSrcRecover: function (component) {

        let record = component.up('menu').dto.record;

        let win = Ext.ComponentQuery.query('trend-bili_zoneexpcsv-win')[0];
        let zoneRecord = win.dto.parent.record;

        let task = new Tool.trend.bili.model.ZoneTaskModel({id: null});
        Ext.apply(task.getProxy().extraParams, {
            zoneId: zoneRecord.get('id'),
            type: 1008,
        });
        task.phantom = true;// 新建
        task.set('id', null);
        task.set('type', 1008);
        task.set('ext', {
            id: record.get('id')
        });
        task.save({
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');
            },
            callback: function (record, operation, success) {
            }
        });


    },
    /*** MIX-end ***/
    doExport: function (component) {
        let me = this;
        let tagRecord = component.up('menu').dto.record;

        let record = Tool.trend.bili.model.TagTaskModel.create();
        let proxy = record.getProxy();
        Ext.apply(proxy.extraParams, {
            tagId: tagRecord.get('id')
        });
        record.set('id', undefined);
        record.set('type', 1002);
        record.phantom = true;// 新建
        record.save({
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');

            },
            callback: function (record, operation, success) {
            }
        });

    },
    doEmpty: function (component) {
        let me = this;
        let tagRecord = component.up('menu').dto.record;

        let record = Tool.trend.bili.model.TagTaskModel.create();
        let proxy = record.getProxy();
        Ext.apply(proxy.extraParams, {
            tagId: tagRecord.get('id')
        });
        record.set('id', undefined);
        record.set('type', 1009);
        record.phantom = true;// 新建
        record.save({
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');
                Ext.ComponentQuery.query('trend-bili_zonetag-win grid')[0].getStore().reload();

            },
            callback: function (record, operation, success) {
            }
        });

    }

});