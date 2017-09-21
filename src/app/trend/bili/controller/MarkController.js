"use strict";
Ext.define('Tool.trend.bili.controller.MarkController', {
    extend: 'Tool.base.controller.MvcController',
    statics: {},
    requires: [
        'Tool.trend.bili.proxy.BiliProxy'
    ],
    views: [
        'Tool.trend.bili.view.MarkPan',
        'Tool.trend.bili.view.MarkWin',
        'Tool.trend.bili.view.ExpressionsWin',
    ],
    stores: [
        'Tool.trend.bili.store.BiliHotStore',
        'Tool.trend.bili.store.MarkHelperStore',
        'Tool.trend.bili.store.MarkStore',
        'Tool.trend.bili.store.MarkStatusStore',
        'Tool.trend.bili.store.PickupStatusStore',
    ],
    models: [
        'Tool.trend.bili.model.MarkModel',
        'Tool.trend.bili.model.MarkBatchModel',
    ],
    init: function () {

        let me = this;
        me.initEvent();
    },
    initEvent: function () {
        let me = this;
        me.control({
            'trend-bili_mark-pan button[doAction]': {click: me.doAction},
            'trend-bili_mark-win button[doAction]': {click: me.doAction},
            'trend-bili_expressions-win button[doAction]': {click: me.doAction},

            'trend-bili_mark-pan grid[action=mark] pagingtoolbar': {beforechange: me.fitParams2Gird},
            'trend-bili_mark-pan grid[action=mark] radiogroup': {change: me.resetMarkData},
            'trend-bili_mark-pan grid[action=mark] combo': {change: me.resetMarkData},

            'trend-bili_mark-pan': {activate: me.initView},


            'trend-bili_mark-pan grid[action=markHelper] pagingtoolbar': {beforechange: me.fitParams2HeplerGird},
            'trend-bili_mark-pan grid[action=markHelper] radiogroup': {change: me.resetHelperData},

            'trend-bili_mark-pan grid': {
                edit: me.doModifyFromGrid,
                columnschanged: me.modifyHeader
            },

        });
    },
    initView: function () {
        let me = this;

        me.fitParams2Gird();
        let markStore = Ext.StoreMgr.get('trend-bili_mark-store');
        markStore.loadPage(1);

        me.fitParams2HeplerGird();
        let markHelperStore = Ext.StoreMgr.get('trend-bili_mark_helper-store');
        markHelperStore.loadPage(1);
    },
    getRank: function () {
        let id = Ext.ComponentQuery.query('trend-index-pan combobox[name=rank]')[0].getValue();
        let userRankStore = Ext.StoreMgr.get('trend-bili_user_rank-store');
        let idx = userRankStore.find('id', id);
        let record = userRankStore.getAt(idx);
        return record;
    },
    getRankId: function () {
        return this.getRank().get('id');
    },
    getRankZoneId: function () {
        return this.getRank().get('zoneId');
    },
    getIndexId: function () {
        let combobox = Ext.ComponentQuery.query('trend-index-pan combobox[name=index]');
        if (combobox == null || combobox.length == 0) {
            ExtUtil.showTip('刊号未选择');
            return null;
        }
        return combobox[0].getValue();
    },
    doShow: function () {

        let aid = Ext.ComponentQuery.query('trend-bili_mark-pan textfield[name=aid]')[0].getValue();
        if (!/^\d+$/.test(aid)) {
            ExtUtil.showTip('参数有误');
            return;
        }
        let rankId = this.getRankId();
        let record = Tool.trend.bili.model.MarkModel.create();
        let proxy = record.getProxy();
        Ext.apply(proxy.extraParams, {
            rankId: rankId
        });
        record.set('id', aid);
        record.load({
            scope: this,
            failure: function (record, operation) {
            },
            success: function (record, operation) {
                let win = Ext.widget('trend-bili_mark-win');
                let form = win.down('form').getForm();
                if (record.get('blackStatus') == 1) {
                    alert('此为黑名单UP主');
                }
                win.show();
                form.setValues(record.getData());

            },
            callback: function (record, operation, success) {
            }
        });


    },

    doModifyFromWin: async function (button) {
        let me = this;
        let win = button.up('window');
        let data = win.down('form').getForm().getValues();

        let rankId = this.getRankId();
        let record = Tool.trend.bili.model.MarkModel.create();
        let proxy = record.getProxy();
        Ext.apply(proxy.extraParams, {
            rankId: rankId
        });
        record.phantom = true;
        record.set('status', data.status);
        record.set('pickupStatus', data.pickupStatus);
        record.set('description', data.description);
        record.set('pickupIndexId', me.getIndexId());
        record.set('id', undefined);
        record.set('aid', parseInt(data.aid));
        record.save({
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');
                win.close();
            }, callback: function (record, operation, success) {

            }
        });

    },
    postMark: function (params) {
        let me = this;
        return new Promise(function (resolve, reject) {
            let record = Tool.trend.bili.model.MarkModel.create();
            record.phantom = true;
            Ext.apply(record.getProxy().extraParams, {
                rankId: me.getRankId()
            });
            record.set('id', null);
            record.set('pickupIndexId', me.getIndexId());
            for (let key in params) {
                record.set(key, params[key]);
            }
            record.save({
                scope: this,
                failure: function (record, operation) {
                    let resp = operation.getError().response;
                    reject(JSON.parse(resp.responseText))
                },
                success: function (record, operation) {
                    let resp = operation.getResponse();
                    resolve(JSON.parse(resp.responseText))
                },
                callback: function (record, operation, success) {
                }
            });
        });

    },
    doModifyFromGrid: async function (gridEditor, e) {
        let me = this;
        if (
            ( e.originalValue == null || e.originalValue == '' ) &&
            ( e.value == null || e.value == '' )
            ||
            e.originalValue == e.value
        ) {
            e.record.reject();
            return null;
        }
        let record = e.record;
        try {
            let status = record.get('status');
            let pickupStatus = record.get('pickupStatus');
            if (e.field == 'pickupStatus') {
                pickupStatus = e.value;
            } else if (e.field == 'status') {
                status = e.value;
            }

            // 只要如推荐都加入收录
            if (pickupStatus == -1 && status == null) {
                e.record.reject();
                return;
            }

            if (e.field == 'pickupStatus' && pickupStatus != null && pickupStatus != 0 && pickupStatus != -1) {
                record.set('status', 1);
                status = 1;
            }

            // 非推荐
            // 如果未收录修改desc_，直接变成存疑
            if (e.field == 'description' && (status == null || status == 0)) {
                record.set('status', 2);
                status = 2;
            }


            // console.log(record.data);
            // console.log(record);
            let ret = {};
            try {

                ret = await me.postMark({
                    'userId': AT.id,
                    'aid': parseInt(record.get('aid')),
                    'description': record.get('description'),
                    'status': parseInt(status),
                    'pickupStatus': parseInt(pickupStatus)
                });

            } catch (e) {
                throw new Error('数据中心连接失败<br>' + e.message);
            }


            if (ret.code == 0) {
                ExtUtil.showTip('av' + record.get('aid') + ' 修改成功');
                record.commit();
            } else {
                ExtUtil.showTip(ret.msg);
                record.reject();
            }
        } catch (err) {
            console.log(err.stack);
            console.log(err);
            record.reject();
            ExtUtil.showTip('av' + record.get('aid') + '<br>' + err.message);
        }
    },


    getMarkHelperMask: function () {
        let myPanel = Ext.ComponentQuery.query('trend-bili_mark-pan grid[action=markHelper]')[0];
        let myMask = new Ext.LoadMask(myPanel, {msg: "正在操作", autoScroll: true, style: 'padding:10px;'});
        return myMask;
    },
    resetMarkData: function (view, newValue, oldValue, eOpts) {
        this.fitParams2Gird();
        let markStore = Ext.StoreMgr.get('trend-bili_mark-store');
        markStore.loadPage(1);

    },
    resetHelperData: function (view, newValue, oldValue, eOpts) {
        if (newValue.order != oldValue.order) {
            let hot_toolbar = Ext.ComponentQuery.query('trend-bili_mark-pan toolbar[action=hot_toolbar]')[0];
            if (newValue.order == 'default') {
                hot_toolbar.hide();
            } else {
                hot_toolbar.show();
            }
        }
        this.fitParams2HeplerGird();
        let markHelperStore = Ext.StoreMgr.get('trend-bili_mark_helper-store');
        markHelperStore.loadPage(1);

    },
    fitParams2Gird: function () {
        let me = this;
        let pan = Ext.ComponentQuery.query('trend-bili_mark-pan')[0];
        let grid = Ext.ComponentQuery.query('trend-bili_mark-pan grid[action=mark]')[0];

        let radiogroup = grid.down('radiogroup[action=status]');
        let radiogroup_value = radiogroup.getValue();
        let combobox = grid.down('combobox[name=index]');
        let pickUpIndexId = combobox.getValue();
        let status = radiogroup_value.status;
        let isPickup = false;
        let pickupStatus = null;
        if ((status + '').startsWith('isPickup:')) {
            isPickup = true;
            pickupStatus = status.split(':')[1];
            status = null;
        }

        let markStore = Ext.StoreMgr.get('trend-bili_mark-store');
        Ext.apply(markStore.getProxy().extraParams, {
            rankId: me.getRankId(),
            status: status,
            pickupStatus: pickupStatus,
            pickUpIndexId: pickUpIndexId
        });
    },

    fitParams2HeplerGird: function () {

        let me = this;
        let grid = Ext.ComponentQuery.query('trend-bili_mark-pan grid[action=markHelper]')[0];
        let radiogroup_value = grid.down('radiogroup[action=action1]').getValue();
        let original = radiogroup_value.original;
        let order = radiogroup_value.order == 'default' ? 0 : 1;
        let order_type = grid.down('radiogroup[action=action2]').getValue().order_type;

        let from = Ext.ComponentQuery.query('trend-bili_mark-pan  grid datefield[name=from]')[0].getValue();
        let to = Ext.ComponentQuery.query('trend-bili_mark-pan grid datefield[name=to]')[0].getValue();
        if (!Ext.Date.between(to, from, Ext.Date.add(from, Ext.Date.MONTH, +2))) {
            ExtUtil.showTip('最大查询范围不能超过三个月');
            return false;
        }

        let date = Ext.util.Format.date(from, "Y-m-d") + '~' + Ext.util.Format.date(to, "Y-m-d");


        let markHelperStore = Ext.StoreMgr.get('trend-bili_mark_helper-store');
        Ext.apply(markHelperStore.getProxy().extraParams, {
            rankId: me.getRankId(),
            tid: me.getRankZoneId(),
            order: order,
            order_type: order_type,
            date: date,
            from: Ext.util.Format.date(from, "Ymd"),
            to: Ext.util.Format.date(to, "Ymd"),
            original: original,
            mask: me.getMarkHelperMask()
        });
    },
    doUpdateUI_headTip: function (batchNo, status, rankInfo) {

        // 初始化头部信息
        let pan = Ext.ComponentQuery.query('trend-bili_desk-pan')[0];
        let store = Ext.StoreMgr.get('trend-bili_status-store');
        let zoneStore = Ext.StoreMgr.get('trend-bili_rankzone-store');
        let record = pan.dto.record;

        let component = Ext.ComponentQuery.query('trend-bili_mark-pan')[0];

        component.down('label[name=name]').setText(record.get('name'));
        if (typeof(batchNo) == 'undefiled' || batchNo == null) {
            component.down('label[name=batchNo]').setText(record.get('batchNo'));
        } else {
            component.down('label[name=batchNo]').setText(batchNo);
        }

        let zoneIndex = zoneStore.find('type', record.get('tid'));
        let zoneRecord = zoneStore.getAt(zoneIndex);
        component.down('label[name=tname]').setText(zoneRecord.get('name'));

        if (rankInfo == null) {

            if (typeof(status) == 'undefiled' || status == null) {
                status = parseInt(record.get('status'));
            }
            let record_ = store.getById(status);
            status = record_.get('name');
            component.down('label[name=status]').setText(status);

        } else {
            component.down('label[name=status]').setText(rankInfo);
        }
    },
    showExpressions: function (button) {
        let expressions = this.getRank().get('expressions');
        let win = Ext.widget('trend-bili_expressions-win');
        win.down('textarea').setValue(expressions);
        win.show(button);
    },
    doSaveExpressions: async function () {
        let win = Ext.ComponentQuery.query('trend-bili_expressions-win')[0];
        let expressions = win.down('textarea').getValue();
        let rankId = this.getRankId();


        let rankDoc = await  NedbUtil.find(AT.cache.nedb.trend_bili, {_id: 'rank'});
        rankDoc = rankDoc[0];

        for (let i = 0; i < rankDoc.items.length; i++) {
            if (rankDoc.items[i]['id'] == rankId) {
                rankDoc.items[i].expressions = expressions;
                break;
            }
        }


        let result = await NedbUtil.update(AT.cache.nedb.trend_bili,
            {
                '_id': 'rank'
            }, rankDoc, {});


        let localRankStore = Ext.StoreMgr.get('trend-bili_local-rank-store');
        localRankStore.loadPage(1, {
            scope: this,
            callback: function (records, operation, success) {
                let idx = localRankStore.getAt(0).get('id');
                Ext.ComponentQuery.query('trend-index-pan combobox[name=rank]')[0].setValue(idx);
            }
        });
        win.close();

        ExtUtil.showTip('操作成功，将在下次加载数据时生效');
    }


});