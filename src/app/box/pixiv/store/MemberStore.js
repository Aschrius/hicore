Ext.define('Tool.box.pixiv.store.MemberStore', {
    extend: 'Ext.data.Store',
    storeId: 'box-pixiv_member-store',
    requires: [
        'Tool.base.ux.HandleProxy'
    ],
    fields: [
        {
            name: 'update_date',
            convert: function (value) {
                let ret = null;
                if (typeof(value) == 'undefined' || value == null || value == 0) {
                } else {
                    ret = Ext.Date.format(new Date(value), "Y-m-d H:i");

                }
                return ret;
            }
        },
        {
            name: 'create_date',
            convert: function (value) {
                let ret = null;
                if (typeof(value) == 'undefined' || value == null || value == 0) {
                } else {
                    ret = Ext.Date.format(new Date(value), "Y-m-d H:i");

                }
                return ret;
            }
        }
    ],
    proxy: {
        type: 'handleproxy',
        handle: async function (opts, fn) {
            // this.extraParams
            try {

                let db = AT.cache.sqlite.box_pixiv;
                let sql = 'select * from pixiv_member order by id desc limit ?,?';
                let countSql = 'select count(1) as c from pixiv_member';

                let result = await SqliteUtil.all(db, sql, [opts.start, opts.limit]);
                let count = await SqliteUtil.all(db, countSql, []);
                count = count[0].c;

                // console.log(result);
                // console.log(count);

                let fn_result = {total: count, limit: opts.limit, data: result};
                fn(fn_result);

            } catch (e) {
                console.error(e);
            }

        }
    }
});
