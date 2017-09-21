"use strict";
Ext.define('Tool.trend.bili.controller.RankController', {
    extend: 'Tool.base.controller.MvcController',
    statics: {},
    views: [
        'Tool.trend.bili.view.RankPan',
        'Tool.trend.bili.view.RankWin',
        'Tool.trend.bili.view.RankMenu',
        'Tool.trend.bili.view.RankRuleWin',
        'Tool.trend.bili.view.RankRuleMenu',
        'Tool.trend.bili.view.RankRuleFilterWin',
        'Tool.trend.bili.view.RankRuleFilterMenu',
        'Tool.trend.bili.view.RankUserWin',
    ],
    stores: [
        'Tool.trend.bili.store.RankStore',
        'Tool.trend.bili.store.RankTypeStore',
        'Tool.trend.bili.store.RankDataTypeStore',
        'Tool.trend.bili.store.RankZoneStore',
        'Tool.trend.bili.store.RankDelayTypeStore',
        'Tool.trend.bili.store.RankRuleStore',
        'Tool.trend.bili.store.RankRuleFilterStore',
        'Tool.trend.bili.store.RankRulePartStore',
        'Tool.trend.bili.store.RankUserStore',
    ],
    models: [
        'Tool.trend.bili.model.RankModel',
        'Tool.trend.bili.model.RankRuleModel',
        'Tool.trend.bili.model.RankRuleFilterModel',
        'Tool.trend.bili.model.RankRulePartModel',
        'Tool.trend.bili.model.RankUserModel',
    ],
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        let me = this;
        me.control({
            /*** 配置通用action ***/
            'trend-bili_rank-pan button[doAction]': {click: me.doAction},
            'trend-bili_rank-win button[doAction]': {click: me.doAction},
            'trend-bili_rank-menu menuitem[doAction]': {click: me.doAction},
            'trend-bili_rank-pan grid': {itemcontextmenu: me.showMenu},
            /*** 配置通用action-end ***/
            'trend-bili_rank-win': {show: me.initRuleGrid},
            'trend-bili_rank-win grid[action=rule]': {
                itemcontextmenu: me.showRuleMenu,
                itemclick: me.initFilterAndPartGrid,
            },
            'trend-bili_rank-win grid[action=filter]': {
                itemcontextmenu: me.showFilterMenu,
            },

            'trend-bili_rank_rule-win button[doAction]': {click: me.doAction},
            'trend-bili_rank_rule-menu menuitem[doAction]': {click: me.doAction},

            'trend-bili_rank_rule_filter-win button[doAction]': {click: me.doAction},
            'trend-bili_rank_rule_filter-menu menuitem[doAction]': {click: me.doAction},
            'trend-bili_rank-pan': {
                afterrender: me.initGrid
            },
            'trend-bili_rank_user-win': {
                afterrender: me.initUserGrid
            },
            'trend-bili_rank_user-win grid checkcolumn': {checkchange: me.doAssignRanking},

        });

    },
    /*** 排行榜表初始化 ***/
    initGrid: function () {
        let grid = Ext.ComponentQuery.query('trend-bili_rank-pan grid')[0];
        let store = grid.getStore();
        store.load();
    },
    /*** 修改榜单的时候加载用 ***/
    initRuleGrid: function (this_, eOpts) {
        // 除了新建之外都需要手动加载
        try {
            if (this_.dto.actionType == 1) return;
            let id = this_.dto.parent.record.get('id');
            let record = new Tool.trend.bili.model.RankModel();
            let proxy = record.getProxy();
            Ext.apply(proxy.extraParams, {
                id: id
            });
            record.set('id', id);

            this_.down('grid[action=filter]').getStore().removeAll();

            let store = this_.down('grid[action=rule]').getStore();
            store.removeAll();

            record.load({
                scope: this,
                callback: function (record, operation, success) {
                    if (success) {
                        let rules = record.get('rules');
                        store.loadData(rules);

                    } else {
                        ExtUtil.showTip('榜单数据加载失败(02)');
                    }
                    delete proxy.extraParams.id;
                }
            });
        } catch (e) {
            ExtUtil.showTip('榜单数据加载失败(01)');
            console.log(e)
        }

    },
    initFilterAndPartGrid: function (this_, record, item, index, e, eOpts) {

        let win = this_.up('window');

        let filters = record.get('filters');
        let filterGrid = win.down('grid[action=filter]');
        let filterStore = filterGrid.getStore();
        filterStore.removeAll();
        if (Array.isArray(filters)) {
            filterStore.loadData(filters);
        }

        let parts = record.get('parts');
        let partGrid = win.down('grid[action=part]');
        let partStore = partGrid.getStore();
        partStore.removeAll();
        if (Array.isArray(parts)) {
            partStore.loadData(parts);
        }


    },
    initUserGrid: function () {
        let win = Ext.ComponentQuery.query('trend-bili_rank_user-win')[0];
        let {record, store} = win.dto.parent;

        let userStore = win.down('grid').getStore();
        let proxy = userStore.getProxy();
        Ext.apply(proxy.extraParams, {
            rankId: record.get('id'),
            type: 'assign'
        });
        userStore.load({
            scope: this,
            callback: function (records, operation, success) {
                // delete proxy.extraParams.rankingId;
                // delete proxy.extraParams.type;
            }
        });
    },
    /*** 展示(通用) ***/
    show: function (component) {

        let win = this.beforeShowWin(component, function (win, dto, data) {
            // 判断是否有


            if (win.getXType() == 'trend-bili_rank-win') {
                // 清空上一次信息
                win.down('form').getForm().reset();
                win.down('grid[action=rule]').getStore().removeAll();
                win.down('grid[action=filter]').getStore().removeAll();


                setTimeout(function () {
                    let radiogroup_isShow = win.down('form').child('radiogroup[action=isShow]');
                    radiogroup_isShow.setValue({
                        isShow: data.isShow
                    });
                    let radiogroup_isRun = win.down('form').child('radiogroup[action=isRun]');
                    radiogroup_isRun.setValue({
                        isRun: data.isRun
                    });
                    let radiogroup_isStrict = win.down('form').child('radiogroup[action=isStrict]');
                    radiogroup_isStrict.setValue({
                        isStrict: data.isStrict
                    });
                }, 1);


            }

            return data;

        });


        win.show(component);
    },

    /*** 添加排行榜 ***/
    doAdd: function () {
        let me = this;
        let {record, win, form} = me.verifyWinForm('trend-bili_rank-win', Tool.trend.bili.model.RankModel);

        // rule
        let rules = [];
        let ruleGrid = win.down('grid[action=rule]');
        let store = ruleGrid.getStore();
        for (let i = 0; i < store.count(); i++) {
            let data_ = store.getAt(i).data;
            // id 规范化
            if (typeof (data_.id) != 'undefined' && !/^\d+$/.test(data_.id)) {
                delete  data_.id;
            }
            let filters = data_.filters;
            let filters_ = [];
            for (let j = 0; j < filters.length; j++) {
                if (typeof (filters[j].id) != 'undefined' && !/^\d+$/.test(filters[j].id)) {
                    delete  filters[j].id;
                }
                filters_.push(filters[j]);
            }
            data_.filters = filters_;

            rules.push(data_);
        }

        record.phantom = true;// 新建
        record.set('rules', rules);
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

    /*** 添加rule ***/
    doRuleAdd: function () {
        let me = this;
        let {record, win, form} = me.verifyWinForm('trend-bili_rank_rule-win', Tool.trend.bili.model.RankRuleModel);

        let value = form.getValues();

        let rankWin = Ext.ComponentQuery.query('trend-bili_rank-win')[0];
        let grid = rankWin.down('grid[action=rule]');
        let store = grid.getStore();
        store.add(value);
        win.close();
    },
    /*** 删除rule ***/
    doRuleDelete: function (component) {
        let {record, store} = component.up('menu').dto;
        store.remove(record);


        let pan = Ext.ComponentQuery.query('trend-bili_rank-win')[0];
        let filterStore = pan.down('grid[action=filter]').getStore();
        filterStore.removeAll();

    },
    doRuleModify: function () {
        let me = this;
        let {record, win, form} = me.verifyWinForm('trend-bili_rank_rule-win', Tool.trend.bili.model.RankRuleModel);
        let values = form.getValues();


        let pan = Ext.ComponentQuery.query('trend-bili_rank-win')[0];
        let store = pan.down('grid[action=rule]').getStore();
        let rowIndex = store.find('version', values.version);
        record = store.getAt(rowIndex);
        for (let key in values) {
            record.set(key, values[key]);
        }
        record.commit();
        win.close();

    },
    /*** filter 删除***/
    doFilterDelete: function (component_) {
        try {

            let me = this;
            let {record, store} = component_.up('menu').dto;
            let version = record.get('version');

            let ruleGrid = Ext.ComponentQuery.query('trend-bili_rank-win grid[action=rule]')[0];
            let ruleStore = ruleGrid.getStore();
            for (let i = 0; i < ruleStore.count(); i++) {
                let re = ruleStore.getAt(i);
                if (re.get('version') == version) {

                    let filters = re.get('filters');
                    let filters_ = [];
                    for (let j = 0; j < filters.length; j++) {
                        if (record.get('tag') == filters[j].tag) {
                            continue;
                        }
                        filters_.push(filters[j]);
                    }

                    re.set('filters', filters_);
                    re.commit();

                    // 删除record
                    store.remove(record);

                    break;
                }
            }

        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    /*** filter 修改***/
    doFilterModify: function () {
        try {
            let me = this;
            let {record, win, form} = me.verifyWinForm('trend-bili_rank_rule_filter-win', Tool.trend.bili.model.RankRuleFilterModel);
            let values = form.getValues();
            let pan = Ext.ComponentQuery.query('trend-bili_rank-win')[0];
            let store = pan.down('grid[action=filter]').getStore();
            let rowIndex = store.find('tag', values.tag);
            record = store.getAt(rowIndex);
            for (let key in values) {
                record.set(key, values[key]);
            }
            record.commit();


            // 修改rule中filter内容
            let version = record.get('version');
            let ruleGrid = Ext.ComponentQuery.query('trend-bili_rank-win grid[action=rule]')[0];
            let ruleStore = ruleGrid.getStore();
            for (let i = 0; i < ruleStore.count(); i++) {
                let re = ruleStore.getAt(i);
                if (re.get('version') == version) {
                    let filters = re.get('filters');

                    for (let j = 0; j < filters.length; j++) {
                        if (record.get('tag') == filters[j].tag) {
                            filters[j] = record.data;
                        }
                    }

                    re.set('filters', filters);
                    re.commit();

                    break;
                }
            }


            win.close();
        } catch (e) {
            console.log(e);
            throw e;
        }

    },
    /*** 添加filter ***/
    doFilterAdd: function () {
        let win = Ext.ComponentQuery.query('trend-bili_rank_rule_filter-win')[0];
        let {record, store, showType} = win.dto.parent;

        let filters = record.get('filters');
        if (typeof (filters) == 'undefined' || filters == null) {
            filters = [];
        }

        let form = win.down('form').getForm();
        let value = form.getValues();
        value.version = record.get('version');
        filters.push(value);

        record.set('filters', filters);
        record.commit();


        let rankWin = Ext.ComponentQuery.query('trend-bili_rank-win')[0];
        let grid = rankWin.down('grid[action=filter]');
        let filterStore = grid.getStore();
        filterStore.add(value);
        win.close();
    },

    /*** 展示规则右键目录 ***/
    showFilterMenu: function (component_, record, item, index, e, eOpts) {
        e.preventDefault();
        let menu = this.beforeShowMenu(component_, record, 'trend-bili_rank_rule_filter-menu');
        menu.showAt(e.getXY());
    },
    showRuleMenu: function (component_, record, item, index, e, eOpts) {
        e.preventDefault();
        let menu = this.beforeShowMenu(component_, record, 'trend-bili_rank_rule-menu');
        menu.showAt(e.getXY());
    },


    /*** 展示右键目录 ***/
    showMenu: function (component, record, item, index, e, eOpts) {
        e.preventDefault();
        let menu = this.beforeShowMenu(component, record, 'trend-bili_rank-menu');
        menu.showAt(e.getXY());
    },
    /*** 修改排行榜 ***/
    doModify: function () {

        let me = this;
        let {record, win, form} = me.verifyWinForm('trend-bili_rank-win', Tool.trend.bili.model.RankModel);

        // rule
        let rules = [];
        let ruleGrid = win.down('grid[action=rule]');
        let store = ruleGrid.getStore();


        for (let i = 0; i < store.count(); i++) {
            let data_ = store.getAt(i).data;
            // id 规范化
            if (typeof (data_.id) != 'undefined' && !/^\d+$/.test(data_.id)) {
                delete  data_.id;
            }
            let filters = data_.filters;
            let filters_ = [];
            for (let j = 0; j < filters.length; j++) {
                if (typeof (filters[j].id) != 'undefined' && !/^\d+$/.test(filters[j].id)) {
                    delete  filters[j].id;
                }
                filters_.push(filters[j]);
            }
            data_.filters = filters_;

            rules.push(data_);
        }

        let proxy = record.getProxy();
        Ext.apply(proxy.extraParams, {
            id: record.get('id')
        });

        record.phantom = false;// 新建
        record.set('rules', rules);
        record.save({
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');
                win.close();
                me.initGrid();
            },
            callback: function (record, operation, success) {
                delete proxy.extraParams.id;
            }
        });

    },
    /*** 授权排行榜 ***/
    doAssignRanking: function (view, rowIndex, checked, eOpts) {


        let win = view.up('window');
        let grid = win.down('grid');
        let gridStore = grid.getStore();
        let {record, store} = win.dto.parent;
        let ruRecord = gridStore.getAt(rowIndex);

        let type = null;
        switch (view['dataIndex']) {
            case 'type_1':
                type = 1;
                break;
            case 'type_2':
                type = 2;
                break;
            case 'type_3':
                type = 3;
                break;
            default:
                ruRecord.reject();
                return;

        }


        let proxy = ruRecord.getProxy();
        let rankId = proxy.extraParams.rankId;
        let preType = proxy.extraParams.type;
        Ext.apply(proxy.extraParams, {
            rankId: rankId
        });
        ruRecord.set('rankId', record.get('id'));
        ruRecord.set('userId', ruRecord.get('id'));
        if (!checked) {
            type = null;
        }
        ruRecord.set('type', type);

        ruRecord.phantom = true;// 新建
        ruRecord.save({
            success: function (record, operation) {

                gridStore.reload();
            },
            callback: function (record, operation, success) {
                delete proxy.extraParams.id;
                Ext.apply(proxy.extraParams, {
                    rankId: rankId,
                    type: preType
                });
                if (success) {
                    record.commit();
                } else {
                    ruRecord.reject();
                }
                ExtUtil.showTip('操作' + (success ? '成功' : '失败'));
            }
        });

    }
});