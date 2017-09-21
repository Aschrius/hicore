Ext.define('Tool.trend.bili.controller.IndexController', {
    extend: 'Tool.base.controller.MvcController',
    requires: [
        'Tool.base.util_node.ImageUtil'
    ],
    views: [
        'Tool.trend.bili.view.IndexPan',
        'Tool.trend.bili.view.IndexMenu',
        'Tool.trend.bili.view.IndexWin',
        'Tool.trend.bili.view.IndexDocWin',
        'Tool.trend.bili.view.IndexExpCsvWin',
        'Tool.trend.bili.view.ExpCsvWin',
        'Tool.trend.bili.view.ExpCsvGrid',
        'Tool.trend.bili.view.IndexExpCsvWin',
        'Tool.trend.bili.view.DocPartWin',
        'Tool.trend.bili.view.DocFilterWin',
    ],
    stores: [
        'Tool.trend.bili.store.IndexStore',
        'Tool.trend.bili.store.ExpCsvStore',
        'Tool.trend.bili.store.IndexExpCsvStore',
        'Tool.trend.bili.store.IndexDocStore',
        'Tool.trend.bili.store.IndexResultStore',
        'Tool.trend.bili.store.IndexStatusStore',
        'Tool.trend.bili.store.ExpCsvStatusStore',
        'Tool.trend.bili.store.FilterStore',
        'Tool.trend.bili.store.PartStore',
        'Tool.trend.bili.store.DocPartStore',
        'Tool.trend.bili.store.DocFilterStore',
    ],
    models: [
        'Tool.trend.bili.model.IndexModel',
        'Tool.trend.bili.model.ExpCsvModel',
        'Tool.trend.bili.model.IndexExpCsvModel',
        'Tool.trend.bili.model.IndexDocModel',
        'Tool.trend.bili.model.IndexResultModel',
        'Tool.trend.bili.model.FilterModel',
        'Tool.trend.bili.model.PartModel',
        'Tool.trend.bili.model.DocPartModel',
        'Tool.trend.bili.model.DocFilterModel',
    ],
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        let me = this;
        this.control({
            'trend-bili_index-pan button[doAction]': {click: me.doAction},
            'trend-bili_index-win button[doAction]': {click: me.doAction},
            'trend-bili_index-menu menuitem[doAction]': {click: me.doAction},
            'trend-bili_indexexpcsv-win button[doAction]': {click: me.doAction},
            'trend-bili_material-win button[doAction]': {click: me.doAction},


            'trend-bili_index-pan grid': {
                itemcontextmenu: me.showMenu,
                afterrender: me.initGird
            },
            'trend-bili_expcsv-win grid': {
                afterrender: me.initExpCsvGird,
                itemclick: me.selectExpCsv
            },
            // 'trend-bili_indexexpcsv-win grid': {
            //     afterrender: me.initIndexExpCsvGird
            // },
            'trend-bili_doc_filter-win grid': {
                afterrender: me.initDocFilterGird
            },
            'trend-bili_doc_filter-win radiogroup': {
                change: me.initDocFilterGird
            },
            // 'trend-bili_material-win radiogroup[action=tag]': {
            //     change: me.initMaterialGird
            // }


            'trend-bili_doc_part-win button[doAction]': {click: me.doAction},
        });
    },
    /*** 展示(通用) ***/
    show: function (component_) {
        let win = this.beforeShowWin(component_);
        win.show(component_);
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
    /*** 展示右键目录 ***/
    showMenu: async function (component_, record, item, index, e, eOpts) {
        e.preventDefault();
        let me = this;
        let store = Ext.StoreMgr.get('trend-bili_bili_part-store');
        Ext.apply(store.getProxy().extraParams, {
            rankId: me.getRankId(),
            indexId: record.get('id')
        });

        // 只是加载store
        store.load({
            scope: this,
            callback: function (records, operation, success) {
                if (success) {
                    if (typeof ( records) == 'undefined' || records == null || records.length == 0) {
                        Ext.MessageBox.show({
                            title: 'Error',
                            msg: '<span style="color:red;font-weight: bold;">暂无分P数据</span>',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    } else {

                        let menu = this.beforeShowMenu(component_, record, 'trend-bili_index-menu');
                        menu.showAt(e.getXY());

                    }
                } else {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: '<span style="color:red;font-weight: bold;">暂无分P数据</span>',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            }
        });


    },
    initGird: function () {
        let pan = Ext.ComponentQuery.query('trend-bili_index-pan')[0];
        let rankId = this.getRankId();
        let store = pan.down('grid').getStore();
        Ext.apply(store.getProxy().extraParams, {
            rankId: rankId
        });
        store.load();
    },
    initExpCsvGird: function (view) {

        let pan = Ext.ComponentQuery.query('trend-bili_index-pan')[0];
        let record = this.getRank();

        let win = Ext.ComponentQuery.query('trend-bili_expcsv-win')[0];

        let grid = win.down('grid');
        let store = grid.getStore();
        Ext.apply(store.getProxy().extraParams, {
            rankId: record.get('id')
        });
        store.load({
            scope: this,
            callback: function (records, operation, success) {
                // console.log(records)
                // console.log(success)
                let win = view.up('window');
                if (success) {
                    if (typeof ( records) == 'undefined' || records == null || records.length == 0) {
                        win.close();
                        Ext.MessageBox.show({
                            title: 'Error',
                            msg: '<span style="color:red;font-weight: bold;">暂无数据</span>',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            }
        });
    },
    initIndexExpCsvGird: function (view) {

        let pan = Ext.ComponentQuery.query('trend-bili_index-pan')[0];
        let record = pan.dto.record;

        let win = Ext.ComponentQuery.query('trend-bili_indexexpcsv-win')[0];
        let indexRecord = win.dto.parent.record;

        let grid = win.down('grid');
        let store = grid.getStore();
        Ext.apply(store.getProxy().extraParams, {
            rankId: record.get('id'),
            indexId: indexRecord.get('id'),
        });
        store.load({
            scope: this,
            callback: function (records, operation, success) {
                let win = view.up('window');
                if (success) {
                    if (typeof ( records) == 'undefined' || records == null || records.length == 0) {
                        win.close();
                        Ext.MessageBox.show({
                            title: 'Error',
                            msg: '<span style="color:red;font-weight: bold;">暂无数据</span>',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            }
        });
    },
    initMaterialGird: function () {
        let pan = Ext.ComponentQuery.query('trend-bili_index-pan')[0];
        let record = pan.dto.record;

        let win = Ext.ComponentQuery.query('trend-bili_material-win')[0];
        let tag = win.down('radiogroup').getValue();
        let grid = win.down('grid');
        let store = grid.getStore();
        Ext.apply(store.getProxy().extraParams, {
            rankId: record.get('id'),
            indexId: win.dto.parent.record.get('id'),
            tag: tag
        });
        store.load({
            scope: this,
            callback: function (records, operation, success) {
                if (success) {
                    if (typeof ( records) == 'undefined' || records == null || records.length == 0) {
                        Ext.MessageBox.show({
                            title: 'Error',
                            msg: '<span style="color:red;font-weight: bold;">暂无数据</span>',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            }
        });

    },
    initDocFilterGird: function () {
        let record = this.getRank();

        let win = Ext.ComponentQuery.query('trend-bili_doc_filter-win')[0];
        let radiogroup = win.down('radiogroup').getValue();
        let grid = win.down('grid');
        let store = grid.getStore();
        Ext.apply(store.getProxy().extraParams, {
            rankId: record.get('id'),
            indexId: win.dto.parent.record.get('id'),
            filterId: radiogroup.filterId
        });
        store.loadPage(1, {
            scope: this,
            callback: function (records, operation, success) {
                if (success) {
                    if (typeof ( records) == 'undefined' || records == null || records.length == 0) {
                        Ext.MessageBox.show({
                            title: 'Error',
                            msg: '<span style="color:red;font-weight: bold;">暂无数据</span>',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            }
        });
    },
    /*** 展示制作页面 ***/
    showDocPartWin: function (menu) {
        let me = this;
        let dto = menu.dto;
        let parentDto = menu.dto.parent;

        let partId = dto.record.get('id');
        let indexId = parentDto.record.get('id');
        let rankId = this.getRankId();

        let win = Ext.widget('trend-bili_doc_part-win', {
            dto: {
                indexRecord: parentDto.record,
                record: dto.record
            }
        });
        let grid = win.down('grid');
        let store = grid.getStore();
        Ext.apply(store.getProxy().extraParams, {
            rankId: rankId,
            indexId: indexId,
            partId: partId
        });
        store.loadPage(1, {
            scope: this,
            callback: function () {
                me.doExpData();
            }
        });

        win.showAt(menu);

    },
    selectExpCsv: function (view, record, item, index, e, eOpts) {
        let win = Ext.widget('trend-bili_index-win', {
            dto: {actionType: 1}
        });
        win.show(view);
        win.down('form').getForm().setValues(record.getData());
        win.dto.record = record;
        view.up('window').close();
    },
    doAdd: async function (button) {
        let myMask = null;

        // 选择数据源后，建立新期刊
        let win = button.up('window');
        let expCsvRecord = win.dto.record;
        let rankRecord = this.getRank();

        myMask = new Ext.LoadMask(win, {msg: "正在操作", autoScroll: true, style: 'padding:10px;'});
        myMask.show();


        let record = Tool.trend.bili.model.IndexModel.create({id: undefined});
        let proxy = record.getProxy();
        Ext.apply(proxy.extraParams, {
            rankId: rankRecord.get('id')
        });
        record.set('id', undefined);
        record.set('incExpCsvId', expCsvRecord.get('id'));
        record.phantom = true;// 新建
        record.save({
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');
                win.close();
            },
            callback: function (record, operation, success) {
                if (success != true) {
                    myMask.hide();
                }
            }
        });

    },
    doRank: function (component) {
        let myMask = null;

        let win = Ext.ComponentQuery.query('trend-bili_index-pan')[0];


        myMask = new Ext.LoadMask(win, {msg: "正在操作", autoScroll: true, style: 'padding:10px;'});
        myMask.show();

        let menu = component.up('menu');
        let indexRecord = null;
        if (typeof(menu) == 'undefined' || menu == null) {
            // index expcsv 入口
            indexRecord = component.up('window').dto.parent.record;
        } else {
            // 是menu入口
            indexRecord = menu.dto.record;
        }
        let type = component.dto.type;
        let id = indexRecord.get('id');

        let record = Tool.trend.bili.model.IndexModel.create({id: undefined});
        let proxy = record.getProxy();
        Ext.apply(proxy.extraParams, {
            rankId: indexRecord.get('rankId')
        });
        record.set('type', type);
        record.set('id', id);
        record.phantom = false;
        record.save({
            success: function (record, operation) {
                ExtUtil.showTip('操作成功');
                window.tt = menu.dto.component;
                let iMask = new Ext.LoadMask(menu.dto.component, {
                    msg: '稍等',
                    autoScroll: true,
                    style: 'padding:10px;'
                });
                iMask.show();

                setTimeout(function () {
                    menu.dto.store.reload();
                    iMask.hide();
                }, 2000);
            },
            callback: function (record, operation, success) {
                myMask.hide();
            }
        });
    },
    doPrepareData: function () {

        let rankRecord = this.getRank();
        let win = Ext.ComponentQuery.query('trend-bili_doc_part-win')[0];
        let grid = win.down('grid');
        let store = grid.getStore();
        let total = store.count();
        if (total == 0) return [];

        let header = {};
        let first = store.getAt(0);
        let isFirst = true;
        for (let field in first.getData()) {
            if (field == 'description') continue;
            if (field == 'id') continue;
            if (field == 'others') continue;
            header[field] = 1;
        }

        let othserHeader = rankRecord.get('rules')[0].scoreCsvHeader.split(',');
        for (let i = 0; i < othserHeader.length; i++) {
            header[othserHeader[i]] = 1;
        }
        othserHeader = othserHeader.slice(1, othserHeader.length)

        let list = [];
        for (let i = 0; i < total; i++) {
            let record = store.getAt(i);
            let data = record.getData();
            let dat = {};
            for (let key in header) {
                dat[key] = data[key];
            }
            let others = data.others.split(',');
            for (let j = 0; j < othserHeader.length; j++) {
                let key = othserHeader[j];
                dat[key] = parseInt(others[j]);
            }
            list.push(dat);
        }
        return list;


    },
    /*** 导出榜单数据功能 ***/
    doExpData: async function () {
        let datas = this.doPrepareData();
        if (datas.length == 0) {
            ExtUtil.showTip('暂无数据');
            return;
        }

        let record = this.getRank();
        let win = Ext.ComponentQuery.query('trend-bili_doc_part-win')[0];
        let partRecord = win.dto.record;

        let headerContent = '';
        let first = datas[0];
        let header = [];
        let isFirst = true;
        for (let field in first) {
            if (field == 'createdDateStr') {
                field = 'date';
            }
            header.push(field);
            if (isFirst) {
                isFirst = false;
            } else {
                headerContent += ',';
            }
            headerContent += field;
        }
        headerContent += '\n';

        let content = "";
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            data['date'] = data.createdDateStr;

            isFirst = true;
            for (let j = 0; j < header.length; j++) {
                let field = header[j];
                if (isFirst) {
                    isFirst = false;
                } else {
                    content += ',';
                }
                content += (data[field] + '').replace(/,/g, '，');
            }
            content += '\n';
        }

        let path = AT.app.path + '/../' + record.get('id') + '_' + partRecord.get('part') + '.CSV';
        await FileUtil.writeFileAsync(path, headerContent + content, 'gbk');
        ExtUtil.showTip('操作完成');


        let exec = require('child_process').exec;
        let cmdStr = 'start ' + path;
        exec(cmdStr, function (err, stdout, stderr) {
        });
    },
    // doExpYml: async function () {
    //     let datas = this.doPrepareData();
    //     let record = this.getRank();
    //     let win = Ext.ComponentQuery.query('trend-bili_material-win')[0];
    //
    //     let outputContent = '---\r\n';
    //     for (let i = 0; i < datas.length; i++) {
    //         outputContent += '- :rank: ' + datas[i].rank + '\r\n';
    //         outputContent += '  :name: av' + datas[i].aid + '\r\n';
    //         outputContent += '  :length: 20' + '\r\n';
    //         outputContent += '  :offset: 0' + '\r\n';
    //     }
    //     let path = AT.path + '../../../' + record.get('id') + '_' + win.down('radiogroup[action=tag]').getValue().tag + '.YML';
    //     await FileUtil.writeFileAsync(path, outputContent, 'utf-8');
    //     ExtUtil.showTip('操作完成');
    //
    //     let exec = require('child_process').exec;
    //     let cmdStr = 'start ' + path;
    //     exec(cmdStr, function (err, stdout, stderr) {
    //     });
    // },
    // doExpImg: async function () {
    //
    //     let datas = this.doPrepareData();
    //     let win = Ext.ComponentQuery.query('trend-bili_doc_part-win')[0];
    //     let partRecord = win.dto.record ;
    //     let type = partRecord.get('avsType') ;
    //
    //     let record = this.getRank();
    //     let rankId = record.get('id');
    //     let tag = win.down('radiogroup[action=tag]').getValue().tag;
    //     // 1. 准备数据
    //     let basePath = AT.path + '../../../' + 'conf/rank/' + rankId + '/tpl/';
    //     let configPath = basePath + tag + '.YML';
    //     let imagePath = basePath + tag + '.PNG';
    //
    //     let tplConfig = await FileUtil.parseYmlAsync(configPath, 'utf-8');
    //     let tplImage = await ImageUtil.loadAsync(imagePath);
    //
    //     let tplCanvas = document.createElement("canvas");
    //     tplCanvas.setAttribute("width", tplImage.width);
    //     tplCanvas.setAttribute("height", tplImage.height);
    //
    //     let tplCtx = tplCanvas.getContext('2d');
    //     let PREFIX = 'av';
    //     let INDEX_FIELD = 'aid';
    //
    //
    //     // 2. 绘制图片
    //     for (let i = 0; i < datas.length; i++) {
    //
    //         // 1.清除数据
    //         ImageUtil.clear(tplCtx, tplImage.width, tplImage.height);
    //         // 2.绘制背景模板
    //         tplCtx.drawImage(tplImage, 0, 0);
    //         // 3.获取数据
    //         let data = datas[i];
    //         // 4. 遍历属性
    //         for (let field in data) {
    //             let value = data[field];
    //             if (field == 'aid') {
    //                 value = 'av' + value;
    //                 console.log('aid....' + value)
    //             }
    //             if (field == 'score') {
    //                 value = parseInt(data[field]) / 100;
    //             }
    //
    //             // 2.4.1.判断config中是否有此配置,亦或配置为空
    //             let config = tplConfig[field];
    //             if (typeof(config) == 'undefined' || config == null || config.oc == false) {
    //                 continue;
    //             }
    //             if (config.isImage == true && config.oc == true) {
    //                 // 2.4.2.绘制图片
    //                 let tempImage = await ImageUtil.loadAsync(value);
    //                 let {tempCanvas, tempCtx} = ImageUtil.newCanvas(tempImage.width, tempImage.height);
    //                 tempCtx.drawImage(tempImage, 0, 0, config.width, config.height);
    //
    //                 let tar = tempCtx.getImageData(0, 0, tempImage.width, tempImage.height);
    //                 let src = tplCtx.getImageData(0, 0, tplImage.width, tplImage.height);
    //                 let fin = ImageUtil.fillImage(src, tar, config.x, config.y);
    //                 tplCtx.putImageData(fin, 0, 0);
    //
    //             } else {
    //                 // 2.4.2.绘制文字
    //                 let conf = ImageUtil.initFontConfig(config);
    //                 // 2.4.3.数字加逗号
    //                 if (field == 'play' || field == 'favorites' || field == 'review' || field == 'videoReview' || field == 'coins' || field == 'score') {
    //                     var ret__ = ExtUtil.splitNumber(parseInt(value));
    //                     conf.text = ret__;
    //                 } else {
    //                     conf.text = value;
    //                 }
    //                 ImageUtil.fillText(tplCtx, conf);
    //             }
    //         }// 遍历结束
    //         // 保存
    //         await ImageUtil.savePngAsync(tplCanvas, AT.path + '../../../_rank_list/' + PREFIX + data[INDEX_FIELD] + '.png');
    //         let logContent = (1 + i) + '-' + INDEX_FIELD + ':' + data[INDEX_FIELD] + '.......done.';
    //         console.log(logContent);
    //     }
    //     ExtUtil.showTip('导出完毕');
    // },


});
