Ext.define('Tool.box.pixiv.store.IllustStore', {
    extend: 'Ext.data.Store',
    storeId: 'box-pixiv_illust-store',
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
            let me = this;
            try {
                let db = AT.cache.sqlite.box_pixiv;
                let sql = `
                select 
                me.avatar as avatar,
                me.id as member_id,
                me.name as member_name,
                il.id as id,
                il.title as title,
                il.cover as cover,
                il.cover_url as cover_url,
                il.type as type,
                il.update_date as update_date ,
                il.create_date as create_date 
                from pixiv_illust il 
                left join pixiv_member me on(me.id = il.member_id)
                where il.member_id=? and status=1 order by il.id desc limit ?,?
                `;
                let countSql = 'select count(1) as c from pixiv_illust where member_id=? and status=1';


                let result = await SqliteUtil.all(db, sql, [me.extraParams.member_id, opts.start, opts.limit]);
                let count = await SqliteUtil.all(db, countSql, [me.extraParams.member_id]);
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
