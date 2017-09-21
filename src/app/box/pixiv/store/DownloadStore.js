Ext.define('Tool.box.pixiv.store.DownloadStore', {
    extend: 'Ext.data.Store',
    storeId: 'box-pixiv_download-store',
    requires: [],
    statics: {
        retryTime: 3,
        retryMaxTime: 0,
        retryErrorIndex: 0,
        DownloadWorker: null,
        doDownloadItem: function (record) {
            let status = record.get('status');
            let data = record.getData();

            if (status == 2) {
                Tool.box.pixiv.store.DownloadStore.DownloadWorker.send({service: 'abort', config: data});
                return;
            }
            if (status != 4 && status != -1) {
                return;
            }
            record.set('status', 3);
            record.commit();
            Tool.box.pixiv.store.DownloadStore.DownloadWorker.send({service: 'add', config: data});
        },
        doDownloadNext: function () {
            let me = Tool.box.pixiv.store.DownloadStore;

            let grid = Ext.ComponentQuery.query('box-pixiv_download-pan grid')[0];
            let store = Ext.StoreMgr.get('box-pixiv_download-store');
            let idx = store.find('status', '4');
            let record = null;
            if (idx == -1) {

                idx = store.find('status', '-1', Tool.box.pixiv.store.DownloadStore.retryErrorIndex);
                Tool.box.pixiv.store.DownloadStore.retryErrorIndex = idx + 1;
                if (idx == -1) {
                    // 重试
                    if (Tool.box.pixiv.store.DownloadStore.retryTime++ > Tool.box.pixiv.store.DownloadStore.retryMaxTime) {
                        return;
                    }
                    Tool.box.pixiv.store.DownloadStore.retryErrorIndex = 0;
                    idx = store.find('status', '-1', Tool.box.pixiv.store.DownloadStore.retryErrorIndex);
                    if (idx == -1) {
                        return;
                    }
                }

            }
            record = store.getAt(idx);
            me.doDownloadItem(record);
            grid.getView().focusRow(idx);

        }
    },
    constructor: function () {
        let me = this;

        let child_process = require('child_process');
        let worker = child_process.fork(__dirname + '/base/worker/DownloadWorker.js', {
            execArgv: process.execArgv
        });
        Tool.box.pixiv.store.DownloadStore.DownloadWorker = worker;

        worker.on('message', function (dto) {
            console.log(dto);
            let id = dto.data.id;
            let record = me.getById(id);
            if(record==null)return;
            switch (dto.service) {
                case 'error':
                    if (record != null) {
                        record.set('status', -1);
                        record.commit();
                    }
                    Tool.box.pixiv.store.DownloadStore.doDownloadNext();
                    break;
                case 'report':
                    let {cursor, total, speed} = dto.data;
                    record.set('status', 2);
                    record.set('cursor', cursor);
                    record.set('total', total);
                    record.set('speed', speed);
                    record.commit();
                    break;
                case 'finish':
                    if (record != null) {
                        me. remove(record);
                    }

                    (async function (id, db) {
                        let sql = '';
                        if (/^a\./.test(id)) {
                            // avatar , 暂时不处理
                            return;
                        } else if (/^c\./.test(id)) {
                            // cover
                            id = id.replace(/^c\./g, '');
                            sql = 'update pixiv_illust set update_date=? where id=?';
                            await SqliteUtil.run(db, sql, [new Date(), id]);
                        } else if (/^i\./.test(id)) {
                            // illust
                            id = id.replace(/^i\./g, '');
                            sql = 'update pixiv_illust_item set status=1,update_date=? where name=?';
                            await SqliteUtil.run(db, sql, [new Date(), id]);

                            let docs = await SqliteUtil.all(db, "SELECT * FROM pixiv_illust_item WHERE illust_id = ( SELECT illust_id FROM pixiv_illust_item WHERE name=? )", [id]);
                            let allFinish = true;
                            for (let i = 0; i < docs.length; i++) {
                                if (docs[i].status != 1) {
                                    allFinish = false;
                                }
                            }
                            if (allFinish && docs != null && docs.length > 0) {
                                sql = 'update pixiv_illust set status=1, update_date=? where id=?';
                                await SqliteUtil.run(db, sql, [new Date(), docs[0].illust_id]);
                                console.log('allFinish yes:' + docs[0].illust_id);
                            }


                        } else {
                            return;
                        }

                    })(id, AT.cache.sqlite.box_pixiv);

                    Tool.box.pixiv.store.DownloadStore.doDownloadNext();
                    break;
            }
        });
        this.callParent();
    },
    fields: [
        'id',
        'url',
        'path',
        'total',
        'cursor',
        'speed',
        'status',
        'headers'
    ],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
});
