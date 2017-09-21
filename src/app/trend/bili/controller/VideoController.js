Ext.define('Tool.trend.bili.controller.VideoController', {
    extend: 'Tool.base.controller.MvcController',
    requires: ['Tool.base.util_node.VideoUtil'],
    views: [
        'Tool.trend.bili.view.VideoPan',
        'Tool.trend.bili.view.VideoMenu',
    ],
    stores: [
        'Tool.trend.bili.store.VideoStore',
        'Tool.trend.bili.store.YmlStore',
    ],
    models: [],
    downloadUtil: null,
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        let me = this;
        this.control({
            'trend-bili_video-pan button[doAction]': {click: me.doAction},
            'trend-bili_video-pan dataview': {afterrender: me.reloadYml},

            'trend-bili_video-menu menuitem[doAction]': {click: me.doAction},
            'trend-bili_video-pan grid': {itemcontextmenu: me.showMenu},


            'trend-bili_video-pan dataview[action=yml]': {
                itemclick: me.loadYmlData
            },
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
    /*** 展示右键目录 ***/
    showMenu: function (component_, record, item, index, e, eOpts) {
        e.preventDefault();
        let menu = this.beforeShowMenu(component_, record, 'trend-bili_video-menu');
        menu.showAt(e.getXY());
    },
    /*** 展示mask ***/
    showMask: function () {
        let myPanel = Ext.ComponentQuery.query('trend-bili_video-pan')[0];
        let myMask = new Ext.LoadMask(myPanel, {msg: "正在操作", autoScroll: true, style: 'padding:10px;'});
        myMask.show();
        return myMask;
    },
    /*** 重新载入目录 ***/
    reloadYml: function () {
        let me = this;
        let myMask = null;
        let fs = require('fs');
        fs.readdir(AT.app.path + '/../', function (err, files) {
            myMask = me.showMask();
            let datas = [];
            for (var i = 0; i < files.length; i++) {
                let regExp = new RegExp('^' + me.getRankId() + '_[^_]+.YML');
                if (regExp.test(files[i])) {
                    datas.push({name: files[i].replace(".YML", '')});
                }
            }

            let pan = Ext.ComponentQuery.query('trend-bili_video-pan')[0];
            let dataview = pan.down('dataview[action=yml]');
            let store = dataview.getStore();
            store.removeAll();

            myMask.hide();
            if (datas.length > 0) {
                store.loadData(datas);
                ExtUtil.showTip('AVS列表加载完毕');
            } else {
                ExtUtil.showTip('暂无数据');
            }
        });
    },
    /*** 重新载入yml数据 ***/
    loadYmlData: async function (dataview, record, item, index, e, eOpts) {
        let me = this;
        let myMask = null;
        try {

            myMask = me.showMask();
            let name = record.get('name');
            let datas = await FileUtil.parseYmlAsync(AT.app.path + '/../' + name + '.YML', 'utf-8');
            for (let i = 0; i < datas.length; i++) {
                if (datas[i][':hit'] != true) {
                    datas[i][':hit'] = false;
                } else {
                    datas[i][':hit'] = true;
                }


                let rate = datas[i][':rate'];
                if (typeof (rate) != 'undefined' && rate != null && rate != '') {
                    datas[i]['status'] = 1;
                }
            }

            let pan = Ext.ComponentQuery.query('trend-bili_video-pan')[0];
            Tool.trend.bili.view.VideoPan.ymlRecord = record;

            let grid = pan.down('grid');
            let store = grid.getStore();
            store.loadData(datas);


            let expAvsButton = pan.down('button[doAction=doExpAvs]');
            let uploadButton = pan.down('button[doAction=doUpload]');
            expAvsButton.setDisabled(true);
            uploadButton.setDisabled(true);


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


            let pause = part.avsPause;
            let top = part.avsTop;

            Ext.getCmp("checkboxgroup_videoOpt_pause").setValue(pause == true);
            Ext.getCmp("checkboxgroup_videoOpt_top").setValue(top == true);

            expAvsButton.setDisabled(false);
            uploadButton.setDisabled(false);


            await me.doAnalyzeVideos();

        } catch (e) {
            throw e;
        } finally {
            myMask.hide();
        }


    },
    /***menu 重新解析 ***/
    doReAnalyzeVideo: async function (component_) {

        let menu = component_.up('menu');
        let {record, store} = menu.dto;

        let name = record.get(':name');
        console.log('reAnalyzeVideo : ' + name);
        await this.doAnalyzeVideo(record);
        ExtUtil.showTip(name + '解析完毕');

    },
    /*** 解析视频 ***/
    doAnalyzeVideo: async function (record) {

        let name = record.get(':name');
        let videoPath = AT.app.path + '/../_rank_video/' + name + '.flv';
        let isExist = await FileUtil.existsAsync(videoPath);
        if (!isExist) {
            record.set('status', 404);
        } else
            try {
                let metadata = await VideoUtil.analyzeAsync(videoPath);
                let streams = metadata.streams;
                let videoStream = null;
                let audioStream = null;
                for (let j = 0; j < streams.length; j++) {
                    if (streams[j].codec_type == "video") {
                        videoStream = streams[j];
                    } else {
                        audioStream = streams[j];
                    }
                }
                record.set(':height', videoStream.height);
                record.set(':width', videoStream.width);
                record.set(':rate', videoStream.r_frame_rate);
                record.set('status', 1);
            } catch (err) {
                console.log(err.stack);
                record.set('status', -1);
            }
        record.commit();
    },
    /*** 解析视频 ***/
    doAnalyzeVideos: async function () {

        let me = this;
        let myMask = null;
        try {

            myMask = me.showMask();

            let fs = require('fs');

            let pan = Ext.ComponentQuery.query('trend-bili_video-pan')[0];
            let ymlRecord = Tool.trend.bili.view.VideoPan.ymlRecord;
            let grid = pan.down('grid[action=data]');
            let store = grid.getStore();

            let reWriteDatas = [];
            for (let i = 0; i < store.count(); i++) {
                let record = store.getAt(i);

                let rate = record.get(':rate');
                if (record.get('status') == 1 || typeof (rate) != 'undefined' && rate != null && rate != '') {
                    record.set('status', 1);


                    let data_ = record.getData();
                    delete  data_.status;
                    delete  data_.id;
                    reWriteDatas.push(data_);

                    continue;
                }

                record.set('status', 2);
                record.commit();

                await me.doAnalyzeVideo(record);

                let data_ = record.data;
                delete  data_.status;
                delete  data_.id;
                reWriteDatas.push(data_);

            }
            let content = await FileUtil.json2Yml(reWriteDatas);
            content = content.replace(/'/g, '');
            content = content.replace(/\r/g, '');
            content = content.replace(/\n/g, '\r\n');

            let name = ymlRecord.get('name');
            await FileUtil.writeFileAsync(AT.app.path + '/../' + name + '.YML', content);


        } catch (e) {
            ExtUtil.showTip(e.message);
            console.log(e.stack);
            throw e;
        } finally {
            myMask.hide();
        }
    },
    /*** 导出avs ***/
    doExpAvs: async function () {

        let ymlRecord = Tool.trend.bili.view.VideoPan.ymlRecord;
        await this.loadYmlData(null, ymlRecord);

        let name = ymlRecord.get('name');
        let [rankId, part] = name.split('_');

        let itcIds = [];
        let cbgItem = Ext.getCmp('checkboxgroup_videoOpt').getChecked();
        Ext.Array.each(cbgItem, function (item) {
            itcIds.push(item.inputValue);
        });
        // alert(itcIds.join(','));

        let pause = itcIds.indexOf('1') != -1 ? true : false;
        let top = itcIds.indexOf('2') != -1 ? true : false;

        let fs = require('fs');
        let me = this;
        let myMask = null;
        try {
            myMask = me.showMask();

            let reqJson = {
                config: {
                    pause: pause,
                    pauseLength: 2,
                    pauseOffset: 0,
                    pauseImagePath: 'conf/trend_bili/' + rankId + '/material/pause.png',
                    pauseVideoPath: 'conf/trend_bili/' + rankId + '/material/pause.mp4',
                    logoImagePath: 'conf/trend_bili/' + rankId + '/material/logo.png',
                    filterPath: __dirname.replace(/\\/g, '/') + (AT.isAsar ? '/..' : '') + '/../exec_modules/avsfilter/',
                    basePath: AT.app.path + '/../',
                    width: 936,
                    height: 526,
                    borderLeft: 0,
                    borderTop: 0,
                    borderRight: 0,
                    borderBottom: 0
                },
                videos: []
            };
            let record_selectYml = Ext.ComponentQuery.query('trend-bili_video-pan dataview[action=yml]')[0].getSelectionModel().getSelection()[0];

            let store = Ext.ComponentQuery.query('trend-bili_video-pan grid[action=data]')[0].getStore();
            for (let i = 0; i < store.count(); i++) {

                let record = store.getAt(i);
                let name = record.get(':name');
                let width = record.get(':width');
                let height = record.get(':height');
                reqJson.videos.push({
                    id: record.get(':name'),
                    hit: record.get(':hit'),
                    width: width,
                    height: height,
                    offset: record.get(':offset'),
                    scoreLength: record.get(':scoreLength'),
                    logoLength: record.get(':logoLength'),
                    length: record.get(':length'),
                    backgroundImagePath: 'conf/trend_bili/' + rankId + '/material/background.png',
                    scoreImagePath: '_rank_list/' + name + '_score.png',
                    logoVideoWidth: 936,
                    logoVideoHeight: 526,
                    videoPath: '_rank_video/' + name + '.flv',
                    imagePath: '_rank_list/' + name + '.png'
                });
            }

            let url = '/api/script/avs/normal';
            if (top) {
                url = '/api/script/avs/top';
            }

            // console.log('reqJson:');
            // console.log(reqJson);

            let resp_ = await RequestUtil.request({
                uri: AT.app.server + url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                json: true,
                body: reqJson
            });

            let contentType = resp_.headers['content-type'];
            if (resp_.statusCode == 200 && contentType == 'text/avs;charset=utf-8') {
                let outputContent = resp_.body;
                let outputFile = record_selectYml.get('name') + '.AVS';
                let outputPath = AT.app.path + '/../' + outputFile;

                await FileUtil.writeFileAsync(outputPath, outputContent);


                ExtUtil.showTip('脚本生成完毕,正在打开视频');
                let cmdStr = 'start ' + outputPath;
                require('child_process').exec(cmdStr, function (err, stdout, stderr) {
                });

            } else {
                let msg = '';
                try {
                    msg = resp_.body.msg;
                    msg = JSON.stringify(resp_.body).msg;
                } catch (e) {
                } finally {
                    ExtUtil.showTip('脚本生成失败:' + msg);
                }
            }


        } catch (e) {
            ExtUtil.showTip(e.message);
            console.log(e.stack);
        } finally {
            myMask.hide();
        }
    },
    doDownloadVideo: function (but) {
        var me = this;

        co(function* () {

            var record_selectYml = Ext.ComponentQuery.query('rankvideopan dataview[action=yml]')[0].getSelectionModel().getSelection()[0];
            var caption = record_selectYml.get('caption');
            // alert(caption);


            var win = Ext.widget('rankvideodownloadwin');
            win.show();

            if (me.downloadUtil == null) {
                me.downloadUtil = new DownloadUtil(win);
            }


            var store = Ext.ComponentQuery.query('rankvideopan grid[action=data]')[0].getStore();
            var MAX_SIZE = 3;
            for (var i = 0; i < store.count(); i++) {
                var record = store.getAt(i);
                var name = record.get(':name');

                var aid = parseInt(name.replace(/av/g, ''));
                var urlObj = {};
                // console.log(urlObj);

                var status = 3;
                var progress = null;
                var filePath = AT.path + '../../i_video/' + name + '.flv';
                var tmpPath = AT.path + '../../i_video/' + name + '.nodetmp';


                var isExists = yield fileUtil.existsCo(filePath);

                // if(isExists==true){
                //     yield fileUtil.renameCo(fileTmpPath,filePath);
                // }


                // 判断是否存在

                if (isExists == true) {
                    status = 1;
                    progress = 100;
                } else {
                    urlObj = yield videoUtil.getBiliVideoUrl(aid);
                }

                var data = {
                    id: aid,
                    name: name,
                    filePath: filePath,
                    tmpPath: tmpPath,
                    url: urlObj.url,
                    size: null,
                    progress: progress,
                    status: status,
                    headers: {}
                };
                ExtUtil.addDownloadTask(me.downloadUtil, data);

            }
            for (var i = 0; i < MAX_SIZE; i++) {
                ExtUtil.startDownloadNextTask(me.downloadUtil);
            }


        }).catch(function (err) {
            ExtUtil.showTip(err.message);
            console.log(err.stack);
            myMask.hide();
        });

    }


});
