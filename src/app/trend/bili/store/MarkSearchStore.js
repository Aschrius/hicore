/**
 * https://search.bilibili.com/ajax_api/video?keyword=308040&page=1&order=totalrank&tids_1=3&tids_2=54&_=1507722578617
 * https://search.bilibili.com/ajax_api/video?keyword=308040&page=1&order=click&tids_1=3&tids_2=54&_=1507722578617
 * https://search.bilibili.com/ajax_api/video?keyword=308040&page=1&order=pubdate&tids_1=3&tids_2=54&_=1507722578617
 * https://search.bilibili.com/ajax_api/video?keyword=308040&page=1&order=dm&tids_1=3&tids_2=54&_=1507722578617
 * https://search.bilibili.com/ajax_api/video?keyword=308040&page=1&order=stow&tids_1=3&tids_2=54&_=1507722578617
 */
Ext.define('Tool.trend.bili.store.MarkSearchStore', {
    extend: 'Ext.data.Store',
    statics: {
        SnapWorker: null
    },
    requires: [
        'Tool.base.ux.HandleProxy',
    ],
    storeId: 'trend-bili_mark_search-store',
    constructor: function () {
        this.callParent();
    },
    fields: [
        'av',
        'author',
        'create',
        'createdDate',
        'play',
    ],
    pageSize: 20,
    proxy: {
        type: 'handleproxy',
        reader: {type: 'json'},
        enablePaging: true,
        handle: function (opts, fn) {

            this.extraParams.mask.show();
            let me = this;

            me.handle_search(opts, fn);
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
                        let json = JSON.parse(resp.responseText);
                        resolve(json.data)

                        let pan = Ext.ComponentQuery.query('trend-bili_mark-pan')[0];
                        let form = pan.down('form[action=markHelper]');
                        form.setTitle(`辅助`);
                        pan.dto.index = null;


                        if (json.data && json.data.index) {
                            let index = json.data.index;
                            pan.dto.index = index;
                            form.setTitle(`辅助 - 第${index.batchNo}期`);

                            let hidePickup = false;
                            if (index.status != null)
                                if (index.status == 2 || index.status == 1 || index.status == -1) {
                                    hidePickup = true;
                                }

                            if (!hidePickup) {
                                let grid = pan.down('grid[action=markHelper]');
                                grid.down('actioncolumn[action=addOrDeleteAction]').show();
                            }

                        }

                    },
                    callback: function (record, operation, success) {
                    }
                });

            });

        },
        handle_search: function (opts, fn) {
            let me = this;
            let tid = me.extraParams.tid;
            let keyword = me.extraParams.keyword;
            let order = me.extraParams.order;

            let page = opts.start / opts.limit + 1;


            Ext.Ajax.request({
                url: 'https://search.bilibili.com/ajax_api/video',
                headers: {},
                params: {
                    tids_1: tid,
                    keyword: keyword,
                    order: order,
                    page: page
                },
                method: 'GET',
                success: async function (response, options) {
                    let json = Ext.JSON.decode(response.responseText);
                    let {code, curPage, html, numPages, numResults, page, trackid, text} = json;


                    let archives = [];
                    try {
                        if (code != 0) {
                            throw new Error(text)
                        }


                        let reg = /data-aid="(\d+)"/g
                        let tmpArray = html.match(reg);
                        let aids = [];
                        tmpArray.forEach(function (val) {
                            let aid = val.substring(10, val.length - 1);
                            aids.push(aid);
                        });


                        let titles = [];
                        reg = /class="title"  title="([^"]+)"/g;
                        tmpArray = html.match(reg);
                        tmpArray.forEach(function (val) {
                            let title = val.substring(22, val.length - 1);
                            titles.push(title);
                        });


                        let desArray = [];
                        reg = /<div class="des hide">[^(<\/div>)]+/g;
                        tmpArray = html.match(reg);
                        tmpArray.forEach(function (val) {
                            let desc = val.substring(23, val.length).trim();
                            desArray.push(desc);
                        });


                        let plays = [];
                        reg = /<i class="icon-playtime" ><\/i>[^(<\/span>)]+/g;
                        tmpArray = html.match(reg);
                        tmpArray.forEach(function (val) {
                            let play = val.substring(31, val.length).trim();
                            plays.push(play);
                        });

                        let videoReviews = [];
                        reg = /<i class="icon-subtitle"><\/i>[^(<\/span>)]+/g;
                        tmpArray = html.match(reg);
                        tmpArray.forEach(function (val) {
                            let videoReviw = val.substring(31, val.length).trim();
                            videoReviews.push(videoReviw);
                        });


                        let creates = [];
                        reg = /<i class="icon-date"><\/i>[^(<\/span>)]+/g;
                        tmpArray = html.match(reg);
                        tmpArray.forEach(function (val) {
                            let create = val.substring(27, val.length).trim();
                            creates.push(create);
                        });


                        let authors = [];
                        reg = /class="up-name"[^>]+>[^<]+/g
                        tmpArray = html.match(reg);
                        tmpArray.forEach(function (val) {
                            let author = '';
                            try {
                                author = val.replace(/class="up-name"[^>]+>/g, '');
                            } catch (e) {
                                console.log(e)
                            }
                            authors.push(author);
                        });


                        let mids = [];
                        reg = /href="\/\/space.bilibili.com\/(\d+)/g
                        tmpArray = html.match(reg);
                        tmpArray.forEach(function (val) {
                            let mid = val.replace(/href="\/\/space.bilibili.com\//g, '');
                            mids.push(mid);
                        });


                        let markMap = new Map();
                        let data = await me.getMarks(aids, me.extraParams.rankId);
                        data.list.forEach(function (data, index) {
                            markMap.set(data.aid, {
                                status: data.status,
                                pickupBatchNo: data.pickupBatchNo,
                                pickupStatus: data.pickupStatus,
                                blackStatus: data.blackStatus,
                                description: data.description,
                                userId: data.userId,
                                thisStatus: data.thisStatus,
                                thisMarkStatus: data.thisMarkStatus,
                                thisRank: data.thisRank,

                            });
                        });

                        // console.log(aids.length)
                        // console.log(markMap)
                        aids.forEach(function (aid, i) {
                            let archive = {};
                            archive.aid = aid;
                            archive.title = titles[i];
                            archive.create = creates[i];
                            archive.play = plays[i];
                            archive.videoReview = videoReviews[i];
                            archive.author = authors[i];
                            archive.mid = mids[i];
                            // archive.desc = desArray[i];

                            let mark = markMap.get(parseInt(aid));
                            if (mark != null) {
                                archive.status = mark.status;
                                archive.description = mark.description;
                                archive.userId = mark.userId;
                                archive.thisRank = mark.thisRank;
                                archive.thisStatus = mark.thisStatus;
                                archive.thisMarkStatus = mark.thisMarkStatus;
                                archive.pickupStatus = mark.pickupStatus;
                                archive.pickupBatchNo = mark.pickupBatchNo;
                                archive.blackStatus = mark.blackStatus;

                            }

                            archives.push(archive);

                        });
                        //    console.log(aids);
                        //    console.log(titles);
                        //    console.log(times);
                        //    console.log(plays);
                        //    console.log(videoReviws);
                        // console.log(authors);
                        //    console.log(desArray);
                        //    console.log(mids);
                        //

                    } catch (e) {
                        console.log(e);
                        Ext.MessageBox.alert('失败', e.message);


                    } finally {
                        me.extraParams.mask.hide();
                        let fn_result = {total: numResults, limit: archives.length, data: archives};
                        // console.log(fn_result);
                        fn(fn_result);

                    }
                },
                failure: function (response, options) {
                    me.extraParams.mask.hide();
                    Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
                }
            });

        }
    }
});
