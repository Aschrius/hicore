"use strict";
Ext.define('Tool.box.pixiv.controller.MemberController', {
    extend: 'Tool.base.controller.MvcController',
    statics: {
        currentProcessSize: null,
        currentProcessTotal: null
    },
    controllers: [],
    requires: [
        'Tool.base.util.ExtUtil',
        'Tool.base.util_node.ElectronUtil',
        'Tool.base.util_node.SqliteUtil',
        'Tool.base.ux.HandleProxy',
        'Tool.base.util.PixivUtil',
    ],
    views: [
        'Tool.box.pixiv.view.MemberPan',
        'Tool.box.pixiv.view.IllustPan',
        'Tool.box.pixiv.view.IllustItemPan',
        'Tool.box.pixiv.view.IllustHelperPan',
        'Tool.box.pixiv.view.LoginWin',
        'Tool.box.pixiv.view.DownloadPan',
        'Tool.box.pixiv.view.IllustItemAnimationPan',
    ],
    stores: [
        'Tool.box.pixiv.store.MemberStore',
        'Tool.box.pixiv.store.IllustStore',
        'Tool.box.pixiv.store.IllustItemStore',
        'Tool.box.pixiv.store.IllustHelperStore',
        'Tool.box.pixiv.store.IllustItemHelperStore',
        'Tool.box.pixiv.store.DownloadStore',
    ],
    models: [],
    init: function () {
        let me = this;
        this.initEvent();
        this.initCache();
    },
    initCache: function () {
        try {
            AT.cache.sqlite = {
                box_pixiv: SqliteUtil.getConnection(AT.app.path + '/../conf/box_pixiv.sqlite')
            };
        } catch (e) {
            console.error(e)
        }

    },
    initEvent: function () {
        let me = this;
        me.control({
            'box-pixiv_member-pan': {
                afterrender: me.initView
            },
            'box-pixiv_member-pan component[doAction]': {
                click: me.doAction
            },

            'box-pixiv_member-pan grid': {
                itemclick: me.showIllust
            },
            'box-pixiv_illust-pan grid': {
                itemclick: me.showIllustItem
            },


            'box-pixiv_illust-helper-pan': {
                afterrender: me.initIllustHelper
            },
            'box-pixiv_illust-helper-pan component[doAction]': {
                click: me.doAction
            },

            'box-pixiv_download-pan component[doAction]': {
                click: me.doAction
            },

            'box-pixiv_illust-pan component[doAction]': {
                click: me.doAction
            },

            'box-pixiv_download-pan grid': {
                itemclick: me.doDownloadItem
            }
        });
    },
    initView: function () {
        let memberStore = Ext.StoreMgr.get('box-pixiv_member-store');
        memberStore.loadPage(1);
    },
    initIllustHelper: function () {

        let store = Ext.StoreMgr.get('box-pixiv_illust-hepler-store');
        let grid = Ext.ComponentQuery.query('box-pixiv_illust-helper-pan grid')[0];
        let myMask = new Ext.LoadMask(grid, {msg: "正在操作"});

        Ext.apply(store.getProxy().extraParams, {
            mask: myMask
        });

        AT.ipcRenderer.send('change-referer', {
            Referer: 'https://www.pixiv.net/',
            urls: ['https://i.pximg.net/*']
        });

    },
    showIllust: async function (view, record, item, index, e) {
        this.toModule({
            toModule: 'box-pixiv_illust-pan', dto: {
                controller: 'Tool.box.pixiv.controller.MemberController'
            }
        });
        let id = record.get('id');
        let pan = Ext.ComponentQuery.query('box-pixiv_illust-pan')[0];

        pan.down('box[action=face]').getEl().dom.src = __dirname + '/box/pixiv/res/pixiv.ico';
        pan.down('label[action=name]').setText('name');
        pan.down('label[action=member_id]').setText('id');
        pan.down('label[action=total]').setText('total');

        let grid = pan.down('grid');
        let store = grid.getStore();
        let proxy = store.getProxy();
        Ext.apply(proxy.extraParams, {
            member_id: id
        });


        pan.down('box[action=face]').getEl().dom.src = AT.app.path + '/../_pixiv/' + id + '/' + record.get('avatar');
        pan.down('label[action=name]').setText(record.get('name'));
        pan.down('label[action=member_id]').setText(id);

        await ExtUtil.storeLoadPage(store, 1);
        pan.down('label[action=total]').setText('总数：' + store.getTotalCount());

    },
    showIllustItem: async function (view, record, item, index, e) {

        let id = record.get('id');
        let member_id = record.get('member_id');
        let member_name = record.get('member_name');
        let avatar = record.get('avatar');
        let title = record.get('title')


        let xtype = 'box-pixiv_illust-item-pan';

        if (record.get('type') == 3) {
            // zip
            xtype = 'box-pixiv_illust-item-animation-pan';
        }
        this.toModule({
            toModule: xtype, dto: {
                controller: 'Tool.box.pixiv.controller.MemberController'
            }
        });

        let pan = Ext.ComponentQuery.query(xtype)[0];

        pan.down('box[action=face]').getEl().dom.src = AT.app.path + '/../_pixiv/' + member_id + '/' + avatar;
        pan.down('label[action=name]').setText(member_name);
        pan.down('label[action=member_id]').setText(member_id);


        let store = Ext.StoreMgr.get('box-pixiv_illust-item-store');
        let proxy = store.getProxy();
        Ext.apply(proxy.extraParams, {
            illust_id: id
        });
        await ExtUtil.storeLoadPage(store, 1);
        if (record.get('type') == 3) {
            let record = store.getAt(0);
            let path = AT.app.path + '/../_pixiv/' + member_id + '/illust/' + record.get('name');
            path = 'box/pixiv/res/animation/demo.html#' + path;
            pan.down('panel[region=center]').setHtml('<iframe width="100%"  height="100%" style="border-top-width: 0px; border-left-width: 0px; border-bottom-width: 0px; border-right-width: 0px" src="' + path + '"/>');
        }
        pan.down('label[action=title]').setText(title);
        pan.down('label[action=total]').setText('总数：' + store.getTotalCount());
    },
    /**
     * 解析现网数据
     */
    anaIllustGroup: async function (ids, mask) {

        // SELECT * FROM pixiv_illust WHERE id in (62539062,1212,123213) and status=1;
        if (ids.length == 0) {
            return;
        }

        let sql = "SELECT * FROM pixiv_illust WHERE id in (";
        for (let i = 0; i < ids.length; i++) {
            if (i == 0) {
                sql += ids[i];
            } else {
                sql += ',' + ids[i];
            }
        }
        sql += ") and status=1";
        let docs = await SqliteUtil.all(AT.cache.sqlite.box_pixiv, sql, []);
        let idSet = new Set();
        for (let i = 0; i < docs.length; i++) {
            let id = parseInt(docs[i].id);
            idSet.add(id);
        }


        docs = [];
        for (let i = 0; i < ids.length; i++) {
            if (idSet.has(parseInt(ids[i]))) {
                continue;
            }
            let doc = await PixivUtil.analyseIllust(ids[i]);
            docs.push(doc);

            Tool.box.pixiv.controller.MemberController.currentProcessSize++;
            if (typeof mask != 'undefined') {
                mask.setLoading('解析作品(' +
                    Tool.box.pixiv.controller.MemberController.currentProcessSize +
                    '/' +
                    Tool.box.pixiv.controller.MemberController.currentProcessTotal +
                    ')');
            }
        }
        return docs;
    },
    anaMemberId: async function () {
        let me = this;
        let button = null;
        try {

            Tool.box.pixiv.controller.MemberController.currentProcessSize = 0;
            Tool.box.pixiv.controller.MemberController.currentProcessTotal = 0;

            let pan = Ext.ComponentQuery.query('box-pixiv_illust-helper-pan')[0];
            button = pan.down('button[doAction=anaMemberId]');
            button.setDisabled(true);

            let textfield = pan.down('textfield[name=memberId]');

            let memberId = textfield.getValue();
            if (!/^\d+$/.test(memberId)) {
                ExtUtil.showTip('参数有误');
                return;
            }
            let fs = require('fs');
            [
                AT.app.path + '/../_pixiv/' + memberId + '/',
                AT.app.path + '/../_pixiv/' + memberId + '/illust',
                AT.app.path + '/../_pixiv/' + memberId + '/cover'
            ].forEach(function (path) {
                if (fs.existsSync(path)) {
                    return;
                }
                fs.mkdirSync(path);
            });


            let dlStore = Ext.StoreMgr.get('box-pixiv_download-store');

            pan.down('box[action=face]').getEl().dom.src = __dirname + '/box/pixiv/res/pixiv.ico';
            pan.down('label[action=name]').setText('name');
            pan.down('label[action=member_id]').setText('id');
            pan.down('label[action=total]').setText('total');


            let store = Ext.StoreMgr.get('box-pixiv_illust-hepler-store');
            Ext.apply(store.getProxy().extraParams, {
                id: memberId
            });

            let record = await ExtUtil.storeLoadPage(store, 1);
            store.getProxy().extraParams.mask.setLoading('正在处理');
            let extraParams = store.getProxy().extraParams;
            pan.down('box[action=face]').getEl().dom.src = extraParams.avatar_url;
            pan.down('label[action=name]').setText('name:' + extraParams.member_name);
            pan.down('label[action=member_id]').setText('id:' + extraParams.id);
            pan.down('label[action=total]').setText('total:' + extraParams.total);

            Tool.box.pixiv.controller.MemberController.currentProcessTotal = store.count();

            // 用户 avatar
            if (!fs.existsSync(AT.app.path + '/../_pixiv/' + memberId + '/' + extraParams.avatar)) {

                dlStore.add({
                    id: 'a.' + extraParams.avatar,
                    path: AT.app.path + '/../_pixiv/' + memberId + '/' + extraParams.avatar,
                    url: extraParams.avatar_url,
                    status: 4,
                    headers: {
                        'referer': 'https://www.pixiv.net/member.php'
                    }
                });
            }

            let map = new Map();
            let threadNum = 8;
            let threadGroup = [];
            for (let i = 0; i < store.count(); i++) {
                let record = store.getAt(i);
                let illustId = record.get('id');
                let cover = record.get('cover');
                map.set(parseInt(illustId), cover);

                let idx = i % threadNum;
                if (typeof(threadGroup[idx]) == 'undefined') {
                    threadGroup[idx] = [];
                }
                threadGroup[idx].push(illustId);

            }

            let promises = threadGroup.map(function (ids) {
                return me.anaIllustGroup(ids, extraParams.mask);
            });

            let results = await ExtUtil.promiseAll(promises);
            let docs = [];
            results.forEach(function (doc_) {
                for (let i = 0; i < doc_.length; i++) {

                    let illust_id = parseInt(doc_[i].illust_id);
                    let cover_url = map.get(illust_id);
                    let cover = cover_url.match(/[^\/]+$/g)[0];
                    doc_[i].cover = cover;
                    doc_[i].cover_url = cover_url;

                    dlStore.add({
                        id: 'c.' + cover,
                        path: AT.app.path + '/../_pixiv/' + memberId + '/cover/' + cover,
                        url: cover_url,
                        status: 4,
                        headers: {
                            'referer': 'https://www.pixiv.net/member.php'
                        }
                    });

                    // 添加到下载store中
                    for (let k = 0; k < doc_[i].imageUrls.length; k++) {
                        let url = doc_[i].imageUrls[k];
                        let name = url.match(/([^\/]+)$/)[0];
                        dlStore.add({
                            id: 'i.' + name,
                            path: AT.app.path + '/../_pixiv/' + memberId + '/illust/' + name,
                            url: url,
                            status: 4,
                            headers: {
                                Referer: "https://www.pixiv.net/member_illust.php?mode=medium&illust_id="
                            }
                        });
                    }


                }
                docs = docs.concat(doc_);
            });

            let pixiv_member = {
                id: memberId,
                avatar: extraParams.avatar,
                avatar_url: extraParams.avatar_url,
                name: extraParams.member_name,
                update_date: new Date()
            };


            await me.infoSave2db(pixiv_member, docs, extraParams.mask);
            me.toModule({
                toModule: 'box-pixiv_download-pan', dto: {
                    controller: 'Tool.box.pixiv.controller.MemberController'
                }
            });
            /**
             * {
             * createDate
             * imageUrls
             * title
             * type
             * }
             */


        } catch (e) {
            console.log(e);
            throw e;
        } finally {
            button.setDisabled(false);
        }

    },
    infoSave2db: async function (pixiv_member, docs, mask) {
        let db = AT.cache.sqlite.box_pixiv;
        // 更新DOC
        await  SqliteUtil.run(db, 'begin', []);
        try {

            let rows = await SqliteUtil.all(db, 'select * from pixiv_member where id=?', [pixiv_member.id]);
            let row = null;
            if (rows.length > 0) {
                row = rows[0];
            }
            if (row != null) {
                console.log('update doc : ' + pixiv_member.id);
                await SqliteUtil.run(db, 'update pixiv_member set update_date=?,avatar=?,avatar_url=? where id=?', [
                    new Date(),
                    pixiv_member.avatar,
                    pixiv_member.avatar_url,
                    pixiv_member.id
                ]);
            } else {
                console.log('create doc : ' + pixiv_member.id);
                await SqliteUtil.run(db, 'insert into pixiv_member(id,avatar,avatar_url,name,create_date,update_date) values(?,?,?,?,?,?)',
                    [
                        pixiv_member.id,
                        pixiv_member.avatar,
                        pixiv_member.avatar_url,
                        pixiv_member.name,
                        new Date(), new Date()
                    ]);
            }

            for (let i = 0; i < docs.length; i++) {
                // 更新ILLUST
                if (typeof mask != 'undefined') {
                    mask.setLoading('保存信息(' +
                        (i + 1) +
                        '/' +
                        docs.length +
                        ')');
                }

                let doc = docs[i];


                let pre_docs = await SqliteUtil.all(db, 'select * from pixiv_illust where id=?', [doc.illust_id]);
                let pre_doc = null;
                if (pre_docs.length > 0) {
                    pre_doc = pre_docs[0];
                }
                if (pre_doc != null) {
                    console.log('update illust : ' + doc.illust_id);
                    await SqliteUtil.run(db, 'update pixiv_illust set update_date=?,cover=?,cover_url=? where id=?', [
                        new Date(),
                        doc.cover,
                        doc.cover_url,
                        doc.illust_id
                    ]);
                } else {
                    console.log('create illust : ' + doc.illust_id);
                    await SqliteUtil.run(db, 'insert into pixiv_illust(id,member_id,title,cover,cover_url,type,create_date,update_date,status) values(?,?,?,?,?,?,?,?,?)',
                        [
                            doc.illust_id,
                            pixiv_member.id,
                            doc.title,
                            doc.cover,
                            doc.cover_url,
                            doc.type,
                            doc.create_date, new Date(),
                            2
                        ]);
                }

                // 更新illust_item
                let imageUrls = doc.imageUrls;
                for (let m = 0; m < imageUrls.length; m++) {

                    let pre_items = await SqliteUtil.all(db, 'select * from pixiv_illust where id=?', [doc.illust_id]);
                    let pre_item = null;
                    if (pre_items.length > 0) {
                        pre_item = pre_items[0];
                    }

                    let imageUrl = imageUrls[m];
                    let name = imageUrl.match(/[^\/]+$/g)[0];
                    if (pre_doc != null) {
                        console.log('update item : ' + name);
                        await SqliteUtil.run(db, 'update pixiv_illust_item set url=?,update_date=? where name=?',
                            [
                                imageUrl,
                                new Date(),
                                name
                            ]);

                    } else {
                        console.log('create item : ' + name);
                        await SqliteUtil.run(db, 'insert into pixiv_illust_item(name,url,illust_id,create_date,update_date,status) values(?,?,?,?,?,?)',
                            [
                                name,
                                imageUrl,
                                doc.illust_id,
                                new Date(), new Date(),
                                2
                            ]);


                    }
                }

            }

        } catch (e) {
            console.log(e);
        } finally {
            await  SqliteUtil.run(db, 'commit', []);
        }
        mask.setLoading(false);


    },
    doDownloadItem: function (_this, record, item, index, e, eOpts) {
        Tool.box.pixiv.store.DownloadStore.doDownloadItem(record);
    },
    doDownloadNext: function () {
        Tool.box.pixiv.store.DownloadStore.retryTime = 0;
        for (let i = 0; i < 5; i++) {
            Tool.box.pixiv.store.DownloadStore.doDownloadNext();
        }
    },
    doUpdate: function () {
        let pan = Ext.ComponentQuery.query('box-pixiv_illust-pan')[0];
        let label = pan.down('label[action=member_id]');
        let member_id = label.text;
        this.toModule({
            toModule: 'box-pixiv_illust-helper-pan', dto: {
                controller: 'Tool.box.pixiv.controller.MemberController'
            }
        });
        pan = Ext.ComponentQuery.query('box-pixiv_illust-helper-pan')[0];

        pan.down('textfield[name=memberId]').setValue(member_id);
        this.anaMemberId();
    },
    doUpdatePage: async function () {

        let self = this;
        let store = Ext.StoreMgr.get('box-pixiv_member-store');
        for (let i = 0; i < store.count(); i++) {
            let member_id = store.getAt(i).get('id');
            self.logger('doUpdatePage - member_id=' + member_id);

            self.toModule({
                toModule: 'box-pixiv_illust-helper-pan', dto: {
                    controller: 'Tool.box.pixiv.controller.MemberController'
                }
            });
            let pan = Ext.ComponentQuery.query('box-pixiv_illust-helper-pan')[0];
            pan.down('textfield[name=memberId]').setValue(member_id);
            await this.anaMemberId();

        }

    }

});
