/**
 * http://s.search.bilibili.com/cate/search?main_ver=v3&search_type=video&view_type=hot_rank&pic_size=160x100&order=click&copy_right=-1&cate_id=31&page=1&pagesize=20&time_from=20170515&time_to=20170522
 * http://s.search.bilibili.com/cate/search?main_ver=v3&search_type=video&view_type=hot_rank&pic_size=160x100&order=scores&copy_right=-1&cate_id=31&page=1&pagesize=20&time_from=20170515&time_to=20170522
 * http://s.search.bilibili.com/cate/search?main_ver=v3&search_type=video&view_type=hot_rank&pic_size=160x100&order=stow&copy_right=-1&cate_id=31&page=1&pagesize=20&time_from=20170515&time_to=20170522
 * http://s.search.bilibili.com/cate/search?main_ver=v3&search_type=video&view_type=hot_rank&pic_size=160x100&order=coin&copy_right=-1&cate_id=31&page=1&pagesize=20&time_from=20170515&time_to=20170522
 * http://s.search.bilibili.com/cate/search?main_ver=v3&search_type=video&view_type=hot_rank&pic_size=160x100&order=dm&copy_right=-1&cate_id=31&page=1&pagesize=20&time_from=20170515&time_to=20170522
 *
 */
Ext.define('Tool.trend.bili.store.MarkHelperStore', {
    extend: 'Ext.data.Store',
    statics: {
        SnapWorker: null
    },
    requires: [
        'Tool.base.ux.HandleProxy',
        'Tool.base.ux.SuperJsonP'
    ],
    storeId: 'trend-bili_mark_helper-store',
    constructor: function () {
        let child_process = require('child_process');
        let worker = child_process.fork(__dirname + '/trend/bili/worker/SnapWorker.js', {
            execArgv: process.execArgv
        });
        Tool.trend.bili.store.MarkHelperStore.SnapWorker = worker;
        worker.on('message', function (mes) {
            console.log(`from SnapWorder, message: ${mes}`);
        });

        this.callParent();
    },
    fields: [
        'av',
        'author',
        'description',
        'create',
        'createdDate',
        'face',
        'favorites',
        'mid',
        'pic',
        'play',
        'video_review',
        'stat',
    ],
    pageSize: 20,
    proxy: {
        type: 'handleproxy',
        reader: {type: 'json'},
        enablePaging: true,
        handle: function (opts, fn) {

            this.extraParams.mask.show();
            let me = this;

            if (typeof (me.extraParams.order) == 'undefined' || me.extraParams.order == 0) {
                // 默认时间
                me.handle_normal(opts, fn);
            } else {
                // 热门
                me.handle_hot(opts, fn);
            }
        },

        getMarks: function (aids, rankId) {
            return new Promise(function (resolve, reject) {

                let record = Tool.trend.bili.model.MarkBatchModel.create();
                record.phantom = true;
                Ext.apply(record.getProxy().extraParams, {
                    rankId: rankId
                });
                record.set('id', null);
                record.set('method', 'query');
                record.set('data', aids);
                record.save({
                    scope: this,
                    failure: function (record, operation) {
                        reject(JSON.parse(operation.error.response.responseText).msg);
                    },
                    success: function (record, operation) {
                        let resp = operation.getResponse();
                        resolve(JSON.parse(resp.responseText).data)
                    },
                    callback: function (record, operation, success) {
                    }
                });

            });

        },
        doSnap: async function (aid, description) {
            try {
                Tool.trend.bili.store.MarkHelperStore.SnapWorker.send({aid: aid, description: description})
            } catch (e) {
                console.log(e);
            }
        },
        handle_hot: async function (opts, fn) {
            let me = this;


            let original = this.extraParams.original;
            let order_type = this.extraParams.order_type;
            let date = this.extraParams.date;
            let from = this.extraParams.from;
            let to = this.extraParams.to;

            let tid = me.extraParams.tid;
            let page = opts.start / opts.limit + 1;

            let size = 20;

            let store = Ext.StoreMgr.get('trend-bili_bili_hot-store');
            Ext.apply(store.getProxy().extraParams, {
                page: page,
                main_ver: 'v3',
                search_type: 'video',
                view_type: 'hot_rank',
                pic_size: '160x100',
                order: order_type,
                copy_right: original == true ? 1 : -1,
                cate_id: tid,
                pagesize: size,
                time_from: from,
                time_to: to
            });
            store.load({
                scope: this,
                callback: async function (records, operation, success) {

                    if (success) {

                        let aids = [];
                        for (let i = 0; i < records.length; i++) {
                            let record = records[i];
                            let archive = record.getData();
                            archive.aid = archive.id;
                            archive.desc = archive.description;
                            delete archive.description;
                            aids.push(archive.aid);

                            me.doSnap(archive.aid, archive.desc);// 快照
                        }

                        let markMap = new Map();
                        let archives = [];
                        try {
                            let data = await me.getMarks(aids, me.extraParams.rankId);
                            data.list.forEach(function (data, index) {
                                markMap.set(data.aid, {
                                    status: data.status,
                                    pickupStatus: data.pickupStatus,
                                    blackStatus: data.blackStatus,
                                    description: data.description,
                                    userId: data.userId,
                                    thisRank: data.thisRank,
                                    thisStatus: data.thisStatus,
                                    thisMarkStatus: data.thisMarkStatus
                                });
                            });
                            records.forEach(function (record) {
                                let archive = record.getData();
                                archive.aid = archive.id;
                                archive.create = archive.pubdate;
                                archive.stat = {
                                    reply: archive.review
                                };
                                archive.desc = archive.description;
                                delete archive.description;

                                let mark = markMap.get(archive.aid);
                                if (mark == 'undefined' || mark == null) {
                                } else {
                                    archive.status = mark.status;
                                    archive.description = mark.description;
                                    archive.userId = mark.userId;
                                    archive.thisRank = mark.thisRank;
                                    archive.thisStatus = mark.thisStatus;
                                    archive.thisMarkStatus = mark.thisMarkStatus;
                                    archive.pickupStatus = mark.pickupStatus;
                                }
                                archives.push(archive);
                            });
                        } catch (e) {
                            console.error(e);
                            ExtUtil.showTip('链接数据中心失败');
                        }

                        let fn_result = {total: store.getTotalCount(), limit: size, data: archives};
                        fn(fn_result);
                    } else {
                        alert('获取bilibili数据失败')
                    }

                    me.extraParams.mask.hide();
                }
            });


        },
        handle_normal: function (opts, fn) {
            let me = this;
            let tid = me.extraParams.tid;
            let page = opts.start / opts.limit + 1;
            Tool.base.ux.SuperJsonP.request({
                url: 'http://api.bilibili.com/archive_rank/getarchiverankbypartion',
                timeout: 10000,
                params: {
                    type: 'jsonp',
                    tid: tid,
                    pn: page
                },
                callbackKey: 'callback',
                callbackName: 'bili_callback_' + new Date().getTime(),
                disableCaching: true,
                disableCachingParam: '&_',
                success: async function (result) {
                    if (result.code == 0) {

                        let aids = [];
                        for (let i = 0; i < result.data.archives.length; i++) {
                            let archive = result.data.archives[i];
                            archive.desc = archive.description;
                            delete archive.description;
                            aids.push(archive.aid);

                            me.doSnap(archive.aid, archive.desc);// 快照
                        }

                        let markMap = new Map();
                        try {
                            let data = await me.getMarks(aids, me.extraParams.rankId);
                            data.list.forEach(function (data, index) {
                                markMap.set(data.aid, {
                                    status: data.status,
                                    pickupStatus: data.pickupStatus,
                                    blackStatus: data.blackStatus,
                                    description: data.description,
                                    userId: data.userId,
                                    thisStatus: data.thisStatus,
                                    thisMarkStatus: data.thisMarkStatus,
                                    thisRank: data.thisRank,

                                });
                            });
                            result.data.archives.forEach(function (archive) {
                                let mark = markMap.get(archive.aid);
                                if (mark == 'undefined' || mark == null) {
                                    return;
                                }
                                archive.status = mark.status;
                                archive.description = mark.description;
                                archive.userId = mark.userId;
                                archive.thisRank = mark.thisRank;
                                archive.thisStatus = mark.thisStatus;
                                archive.thisMarkStatus = mark.thisMarkStatus;
                                archive.pickupStatus = mark.pickupStatus;
                                archive.blackStatus = mark.blackStatus;
                            });
                        } catch (e) {
                            console.error(e);
                            ExtUtil.showTip('链接数据中心失败');
                        }


                        let archives = result.data.archives;
                        let count = result.data.page.count;
                        let num = result.data.page.num;
                        let size = result.data.page.size;
                        let fn_result = {total: count, limit: size, data: archives};
                        fn(fn_result);
                    } else {
                        alert('获取bilibili数据失败')
                    }

                    me.extraParams.mask.hide();
                },
                failure: function (result) {
                    me.extraParams.mask.hide();
                    alert(result);
                }
            });

        },
        handle_hot_: async function (opts, fn) {
            let me = this;
            let tid = this.extraParams.tid;
            let date = this.extraParams.date;
            let original = this.extraParams.original;
            let order_type = this.extraParams.order_type;
            let page = opts.start / opts.limit + 1;
            try {
                let result = await BiliUtil.analyzePageAsync(tid, page, date, order_type, original);

                let aids = [];
                let archives = [];
                result.list.forEach(function (value, index) {
                    archives.push({
                        aid: parseInt(value.aid),
                        author: value.author,
                        create: value.createdDate,
                        desc: value.desc,
                        title: value.title,

                        favorites: parseInt(value.favorites),
                        mid: parseInt(value.mid),
                        play: parseInt(value.play),
                        video_review: parseInt(value.videoReview),
                        pic: value.pic
                    });
                    aids.push(parseInt(value.aid));

                    me.doSnap(value.aid, value.desc);// 快照
                });


                let markMap = new Map();
                try {
                    let data = await me.getMarks(aids, me.extraParams.rankId);
                    data.list.forEach(function (data, index) {
                        markMap.set(data.aid, {
                            status: data.status,
                            pickupStatus: data.pickupStatus,
                            description: data.description,
                            userId: data.userId,
                            thisMarkStatus: data.thisMarkStatus,
                            thisStatus: data.thisStatus,
                            thisRank: data.thisRank
                        });
                    });
                    archives.forEach(function (archive) {
                        let mark = markMap.get(archive.aid);
                        if (mark == 'undefined' || mark == null) {
                            return;
                        }
                        archive.status = mark.status;
                        archive.description = mark.description;
                        archive.userId = mark.userId;
                        archive.thisRank = mark.thisRank;
                        archive.thisStatus = mark.thisStatus;
                        archive.thisMarkStatus = mark.thisMarkStatus;
                        archive.pickupStatus = mark.pickupStatus;
                        archive.blackStatus = mark.blackStatus;
                    });
                } catch (e) {
                    console.error(e);
                    ExtUtil.showTip('链接数据中心失败');
                }


                let limit = 20;
                let total = parseInt(result.totalPage) * limit;
                let fn_result = {total: total, limit: limit, data: archives};
                fn(fn_result);
            } catch (e) {
                console.error(e);
                alert(e.message);
            } finally {
                me.extraParams.mask.hide();
            }

        }
    }
});
