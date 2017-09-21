Ext.define('Tool.trend.bili.controller.MaterialController', {
    extend: 'Tool.base.controller.MvcController',
    views: ['Tool.trend.bili.view.MaterialPan'],
    stores: [
        'Tool.trend.bili.store.CsvStore',
        'Tool.trend.bili.store.CsvDataStore',
    ],
    models: [],
    downloadUtil: null,
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        let me = this;
        this.control({
            'trend-bili_material-pan button[doAction]': {click: me.doAction},
            'trend-bili_material-pan dataview': {afterrender: me.reloadCsv},

            'trend-bili_material-pan dataview[action=csv]': {itemclick: me.loadCsvData},

            'trend-bili_material-menu menuitem[doAction]': {click: me.doAction},
        });
    },
    /*** 获取rank信息 ***/

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
    getRankTid: function () {
        return this.getRank().get('tid');
    },
    getPart: function (name) {
        let me = this;
        let rank = me.getRank();
        let part = null;
        for (let i = 0; i < rank.get('parts').length; i++) {
            let partTmp = rank.get('parts')[i];
            if (rank.id + '_' + partTmp.part == name) {
                part = partTmp;
            }
        }
        return part;
    },
    /*** 展示mask ***/
    showMask: function () {
        let myPanel = Ext.ComponentQuery.query('trend-bili_material-pan')[0];
        let myMask = new Ext.LoadMask(myPanel, {msg: "正在操作", autoScroll: true, style: 'padding:10px;'});
        myMask.show();
        return myMask;
    },
    /*** 重新载入目录 ***/
    reloadCsv: function () {
        try {

            let me = this;
            let myMask = null;
            let fs = require('fs');
            fs.readdir(AT.app.path + '/../', function (err, files) {
                myMask = me.showMask();
                let datas = [];
                for (let i = 0; i < files.length; i++) {
                    let regExp = new RegExp('^' + me.getRankId() + '_[^_]+.CSV');
                    if (regExp.test(files[i])) {
                        datas.push({name: files[i].replace(".CSV", '')});
                    }
                }

                let pan = Ext.ComponentQuery.query('trend-bili_material-pan')[0];
                let dataview = pan.down('dataview[action=csv]');
                let store = dataview.getStore();
                store.removeAll();

                myMask.hide();
                if (datas.length > 0) {
                    store.loadData(datas);
                    ExtUtil.showTip('CSV列表加载完毕');
                } else {
                    ExtUtil.showTip('暂无数据');
                }
            });

        } catch (e) {
            console.log(e)

        }
    },
    /*** 重新载入数据 ***/
    loadCsvData: async function (dataview, record, item, index, e, eOpts) {
        let me = this;
        let myMask = null;
        try {
            myMask = me.showMask();
            let name = record.get('name');
            let datas = await FileUtil.parseCsvAsync(AT.app.path + '/../' + name + '.CSV', 'GBK');
            let pan = Ext.ComponentQuery.query('trend-bili_material-pan')[0];
            Tool.trend.bili.view.MaterialPan.csvRecord = record;

            let grid = pan.down('grid[action=data]');
            let store = grid.getStore();
            store.removeAll();


            let rank = me.getRank();
            let indexId = Ext.ComponentQuery.query('trend-index-pan combobox[name=index]')[0].getValue();
            let rankIndexstore = Ext.StoreMgr.get('trend-bili_rank_index-store');
            let idx = rankIndexstore.find('id', indexId);
            let index = rankIndexstore.getAt(idx);


            let rules = rank.get('rules');
            let rule = null;
            rules.forEach(function (r) {
                if (r.id == index.get('ruleId')) {
                    rule = r;
                }
            });


            let radioOrder = pan.down('radiogroup[action=sort]');
            let typeOrder = pan.down('radiogroup[action=type]');
            let button = pan.down('button[doAction=doExpAll]');

            Ext.getCmp("checkboxgroup_meterial_top").setValue(false);
            radioOrder.setValue({sort: 1});
            typeOrder.setValue({type: 1});
            button.setDisabled(true);

            if (rule == null) {
                ExtUtil.showTip('无相关配置(rule)');
                return;
            }

            let parts = rule.parts;
            let part = null;
            for (let i = 0; i < parts.length; i++) {
                let partTmp = parts[i];
                if (rank.get('id') + '_' + partTmp.part == name) {
                    part = partTmp;
                }
            }

            if (part == null) {
                ExtUtil.showTip('无相关配置(part)');
                return;
            }

            // update ui
            datas.sort(function (a, b) {
                return (parseInt(a.rank) - parseInt(b.rank)) * parseInt(part.resultSort);
            });

            radioOrder.setValue({sort: parseInt(part.resultSort)});
            typeOrder.setValue({type: parseInt(part.avsType)});
            Ext.getCmp("checkboxgroup_meterial_top").setValue(part.avsTop == true);
            button.setDisabled(false);

            // 时间修正
            datas.forEach(function (value) {
                if (typeof value.date != 'undefined') {
                    value.date = value.date.replace(/\//g, '-');
                }
            });
            store.loadData(datas);

        } catch (e) {
            throw e;
        } finally {
            myMask.hide();
        }


    },
    /*** 导出脚本以及图片 ***/
    doExpAll: async function () {

        try {

            let pan = Ext.ComponentQuery.query('trend-bili_material-pan')[0];
            let record = Tool.trend.bili.view.MaterialPan.csvRecord;
            if (record == null) throw new Error('未加载数据');
            let name = record.get('name');
            let [rankId, partId] = name.split('_');
            let grid = pan.down('grid');
            let store = grid.getStore();
            let data = store.getData();

            let sort = parseInt(pan.down('radiogroup[action=sort]').getValue().sort);
            let type = parseInt(pan.down('radiogroup[action=type]').getValue().type);
            let top = Ext.getCmp("checkboxgroup_meterial_top").getValue();


            let datas = [];
            for (let i = 0; i < data.length; i++) {
                let dat = store.getAt(i);
                let rank = parseInt(dat.get('rank'));

                let dataTmp = {};
                dataTmp = dat.getData();
                delete dataTmp.id;
                dataTmp.date = dataTmp.date.replace(/\//g, '-');

                datas.push(dataTmp);
            }
            datas = datas.sort(function (o1, o2) {
                return (parseInt(o1.rank) - parseInt(o2.rank)) * parseInt(sort);
            });

            // let part = this.getPart(name);
            // let top = false;
            // if (part != null) {
            //     top = part.top == true;
            // }


            if (top) {
                this.doExpImp_score(datas, name);
                datas.shift();// 默认第一个不输出
            }

            await this.doExpImg(datas, name);
            if (type == 2) {
                // 副刊
                await this.doSpliceImp(datas, name);
            } else {
                // 主刊
                await this.doExpYml(datas, name, top);
            }

            ExtUtil.showTip('操作完成');
        } catch (e) {
            console.log(e);
            ExtUtil.showTip(e.message);
        }

    },
    doExpYml: async function (datas, name, top) {
        let outputContent = '---\r\n';
        for (let i = 0; i < datas.length; i++) {
            outputContent += '- :rank: ' + datas[i].rank + '\r\n';
            outputContent += '  :name: av' + datas[i].aid + '\r\n';

            if (top) {
                outputContent += '  :scoreLength: 10' + '\r\n';
                outputContent += '  :length: 20' + '\r\n';
                outputContent += '  :logoLength: 30' + '\r\n';
            } else {
                outputContent += '  :length: 20' + '\r\n';
            }

            outputContent += '  :offset: 0' + '\r\n';
        }
        let path = AT.app.path + '/../' + name + '.YML';
        await FileUtil.writeFileAsync(path, outputContent, 'utf-8');

        let exec = require('child_process').exec;
        let cmdStr = 'start ' + path;
        exec(cmdStr, function (err, stdout, stderr) {
        });
    },
    doSpliceImp: async function (datas, name) {


        let me = this;
        let pan = Ext.ComponentQuery.query('trend-bili_material-pan')[0];

        let rank = this.getRank();
        let part = name.split('_')[1];

        // 1. 准备数据
        let basePath = AT.app.path + '/../conf/trend_bili/' + rank.get('id') + '/tpl/';
        let configPath = basePath + part + '_splice.YML';
        let imagePath = basePath + part + '_splice.PNG';


        let tplConfig = await FileUtil.parseYmlAsync(configPath, 'utf-8');
        let tplImage = await ImageUtil.loadAsync(imagePath);

        let confTmp = {};
        let spliceParams = [];
        let spliceSize = 0;
        for (let key in tplConfig) {
            let conf = tplConfig[key];
            if (conf.isSplice) {
                spliceSize = conf.items.length;
                spliceParams.push(key);

                for (let i = 0; i < spliceSize; i++) {
                    confTmp[key + '_' + i] = conf.items[i];
                }
            } else {
                confTmp[key] = tplConfig[key];
            }
        }

        // 补充img
        for (let i = 0; i < datas.length; i++) {
            datas[i].pic = AT.app.path + '/../_rank_list/av' + datas[i].aid + '.png';
        }


        // 展开配置
        let datas_ = [];
        let dataTmp = null;
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            let remainder = i % spliceSize;
            if (remainder == 0) {
                // first
                dataTmp = {};
            }
            for (let key in data) {
                if (spliceParams.indexOf(key) == -1) {
                    continue;
                }

                dataTmp[key + '_' + remainder] = data[key];
            }

            if (remainder == spliceSize - 1) {
                datas_.push(dataTmp);
            }
        }

        if (datas.length % spliceSize != 0) {
            datas_.push(dataTmp);
        }


        datas = datas_;
        tplConfig = confTmp;


        let tplCanvas = document.createElement("canvas");
        tplCanvas.setAttribute("width", tplImage.width);
        tplCanvas.setAttribute("height", tplImage.height);

        let tplCtx = tplCanvas.getContext('2d');


        let PREFIX = name + '-splice-';
        let INDEX_FIELD = 'aid';

        // 2. 绘制图片
        for (let i = 0; i < datas.length; i++) {

            // 1.清除数据
            ImageUtil.clear(tplCtx, tplImage.width, tplImage.height);
            // 2.绘制背景模板
            tplCtx.drawImage(tplImage, 0, 0);
            // 3.获取数据
            let data = datas[i];
            // 4. 遍历属性
            for (let field in data) {
                let value = data[field];
                if (field == 'aid') {
                    value = 'av' + value;
                    console.log('aid....' + value)
                }
                if (field == 'score') {
                    value = parseInt(data[field]) / 100;
                }

                // 2.4.1.判断config中是否有此配置,亦或配置为空
                let config = tplConfig[field];
                if (typeof(config) == 'undefined' || config == null || config.oc == false) {
                    continue;
                }
                if (config.isImage == true && config.oc == true) {
                    // 2.4.2.绘制图片
                    let tempImage = await ImageUtil.loadAsync(value);
                    let {context, canvas} = ImageUtil.newCanvas(tempImage.width, tempImage.height);
                    context.drawImage(tempImage, 0, 0, tempImage.width, tempImage.height);

                    let tar = context.getImageData(0, 0, tempImage.width, tempImage.height);
                    let src = tplCtx.getImageData(0, 0, tplImage.width, tplImage.height);
                    let fin = ImageUtil.fillImage(src, tar, config.x, config.y);
                    tplCtx.putImageData(fin, 0, 0);


                } else {
                    // 2.4.2.绘制文字
                    let conf = ImageUtil.initFontConfig(config);
                    // 2.4.3.数字加逗号
                    if (field == 'play' || field == 'favorites' || field == 'review' || field == 'videoReview' || field == 'coins' || field == 'score') {
                        var ret__ = ExtUtil.splitNumber(parseInt(value));
                        conf.text = ret__;
                    } else {
                        conf.text = value;
                    }
                    ImageUtil.fillText(tplCtx, conf);
                }
            }// 遍历结束
            // 保存
            let fit0i = me.fit0((i + 1), datas.length);
            await ImageUtil.savePngAsync(tplCanvas, AT.app.path + '/../_rank_list/' + PREFIX + fit0i + '.png');
            let logContent = (1 + i) + ':' + PREFIX + fit0i + '.......done.';
            console.log(logContent);
        }
        // ExtUtil.showTip('导出完毕');


    },
    fit0: function (i, total) {
        let i_digit = (i + '').length;
        let total_digit = (total + '').length;
        let result = '' + i;
        for (let cursor = 0; cursor < total_digit - i_digit; cursor++) {
            result = '0' + result;
        }
        return result;
    },
    doExpImp_score: async function (datas, name) {

        // 预先处理
        let datasTmp = [];
        for (var i = 1; i < datas.length; i++) {
            let datTmp = datas[i];
            datasTmp.push({
                aid: datas[i].aid,
                score: parseInt(datas[i].score) - parseInt(datas[i - 1].score),
                rank: parseInt(datas[i].rank),
                lastRank: parseInt(datas[i - 1].rank)
            });
        }
        datas = datasTmp;


        let pan = Ext.ComponentQuery.query('trend-bili_material-pan')[0];
        let type = parseInt(pan.down('radiogroup[action=type]').getValue().type); // 1:主榜;2:副榜

        let rank = this.getRank();
        let part = name.split('_')[1];

        // 1. 准备数据
        let basePath = AT.app.path + '/../conf/trend_bili/' + rank.get('id') + '/tpl/';
        let configPath = basePath + part + '_score.YML';
        let imagePath = basePath + part + '_score.PNG';

        let tplConfig = await FileUtil.parseYmlAsync(configPath, 'utf-8');
        let tplImage = await ImageUtil.loadAsync(imagePath);

        let tplCanvas = document.createElement("canvas");
        tplCanvas.setAttribute("width", tplImage.width);
        tplCanvas.setAttribute("height", tplImage.height);

        let tplCtx = tplCanvas.getContext('2d');
        let PREFIX = 'av';
        let INDEX_FIELD = 'aid';


        // 2. 绘制图片
        for (let i = 0; i < datas.length; i++) {

            // 1.清除数据
            ImageUtil.clear(tplCtx, tplImage.width, tplImage.height);
            // 2.绘制背景模板
            tplCtx.drawImage(tplImage, 0, 0);
            // 3.获取数据
            let data = datas[i];
            // 4. 遍历属性
            for (let field in data) {
                let value = data[field];
                if (field == 'aid') {
                    value = 'av' + value;
                    console.log('aid....' + value)
                }
                let decimal = '';
                if (field == 'score') {
                    decimal = '.' + parseInt(data[field]) % 100;
                    value = parseInt(data[field]) / 100;
                }

                // 2.4.1.判断config中是否有此配置,亦或配置为空
                let config = tplConfig[field];
                if (typeof(config) == 'undefined' || config == null || config.oc == false) {
                    continue;
                }
                if (config.isImage == true && config.oc == true) {
                    // 2.4.2.绘制图片
                    let tempImage = await ImageUtil.loadAsync(value);
                    let {tempCanvas, tempCtx} = ImageUtil.newCanvas(tempImage.width, tempImage.height);
                    tempCtx.drawImage(tempImage, 0, 0, config.width, config.height);

                    let tar = tempCtx.getImageData(0, 0, tempImage.width, tempImage.height);
                    let src = tplCtx.getImageData(0, 0, tplImage.width, tplImage.height);
                    let fin = ImageUtil.fillImage(src, tar, config.x, config.y);
                    tplCtx.putImageData(fin, 0, 0);

                } else {
                    // 2.4.2.绘制文字
                    let conf = ImageUtil.initFontConfig(config);
                    // 2.4.3.数字加逗号
                    if (field == 'play' || field == 'favorites' || field == 'review' || field == 'videoReview' || field == 'coins' || field == 'score') {
                        var ret__ = ExtUtil.splitNumber(parseInt(value));
                        ret__ = ret__ + decimal;

                        conf.text = ret__;
                    } else {
                        conf.text = value;
                    }
                    ImageUtil.fillText(tplCtx, conf);
                }
            }// 遍历结束
            // 保存
            await ImageUtil.savePngAsync(tplCanvas, AT.app.path + '/../_rank_list/' + PREFIX + data[INDEX_FIELD] + '_score.png');
            let logContent = (1 + i) + '-' + INDEX_FIELD + ':' + data[INDEX_FIELD] + '.......done.';
            console.log(logContent);
        }
        // ExtUtil.showTip('导出完毕');

    },
    doExpImg: async function (datas, name) {
        let pan = Ext.ComponentQuery.query('trend-bili_material-pan')[0];
        let type = parseInt(pan.down('radiogroup[action=type]').getValue().type); // 1:主榜;2:副榜

        let rank = this.getRank();
        let part = name.split('_')[1];

        // 1. 准备数据
        let basePath = AT.app.path + '/../conf/trend_bili/' + rank.get('id') + '/tpl/';
        let configPath = basePath + part + '.YML';
        let imagePath = basePath + part + '.PNG';

        let tplConfig = await FileUtil.parseYmlAsync(configPath, 'utf-8');
        let tplImage = await ImageUtil.loadAsync(imagePath);

        let tplCanvas = document.createElement("canvas");
        tplCanvas.setAttribute("width", tplImage.width);
        tplCanvas.setAttribute("height", tplImage.height);

        let tplCtx = tplCanvas.getContext('2d');
        let PREFIX = 'av';
        let INDEX_FIELD = 'aid';


        // 2. 绘制图片
        for (let i = 0; i < datas.length; i++) {

            // 1.清除数据
            ImageUtil.clear(tplCtx, tplImage.width, tplImage.height);
            // 2.绘制背景模板
            tplCtx.drawImage(tplImage, 0, 0);
            // 3.获取数据
            let data = datas[i];
            // 4. 遍历属性
            for (let field in data) {
                let value = data[field];
                if (field == 'aid') {
                    value = 'av' + value;
                    console.log('aid....' + value)
                }
                if (field == 'score') {
                    value = parseInt(data[field]) / 100;
                }

                // 2.4.1.判断config中是否有此配置,亦或配置为空
                let config = tplConfig[field];
                if (typeof(config) == 'undefined' || config == null || config.oc == false) {
                    continue;
                }
                if (config.isImage == true && config.oc == true) {
                    // 2.4.2.绘制图片
                    let tempImage = await ImageUtil.loadAsync(value);
                    let retC = ImageUtil.newCanvas(tempImage.width, tempImage.height);
                    let tempCanvas = retC.canvas;
                    let tempCtx = retC.context;
                    tempCtx.drawImage(tempImage, 0, 0, config.width, config.height);

                    let tar = tempCtx.getImageData(0, 0, tempImage.width, tempImage.height);
                    let src = tplCtx.getImageData(0, 0, tplImage.width, tplImage.height);
                    let fin = ImageUtil.fillImage(src, tar, config.x, config.y);
                    tplCtx.putImageData(fin, 0, 0);

                } else {
                    // 2.4.2.绘制文字
                    let conf = ImageUtil.initFontConfig(config);
                    // 2.4.3.数字加逗号
                    if (field == 'play' || field == 'favorites' || field == 'review' || field == 'videoReview' || field == 'coins' || field == 'score') {
                        var ret__ = ExtUtil.splitNumber(parseInt(value));
                        conf.text = ret__;
                    } else {
                        conf.text = value;
                    }
                    ImageUtil.fillText(tplCtx, conf);
                }
            }// 遍历结束
            // 保存
            await ImageUtil.savePngAsync(tplCanvas, AT.app.path + '/../_rank_list/' + PREFIX + data[INDEX_FIELD] + '.png');
            let logContent = (1 + i) + '-' + INDEX_FIELD + ':' + data[INDEX_FIELD] + '.......done.';
            console.log(logContent);
        }
        // ExtUtil.showTip('导出完毕');
    }
});
