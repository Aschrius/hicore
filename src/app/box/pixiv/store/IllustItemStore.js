Ext.define('Tool.box.pixiv.store.IllustItemStore', {
    extend: 'Ext.data.Store',
    storeId: 'box-pixiv_illust-item-store',
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
                  it.name as name,
                  it.url as url,
                  it.illust_id as illust_id,
                  it.status as status,
                  it.update_date as update_date ,
                  it.create_date as create_date ,
                  il.member_id as member_id,
                  il.type as type,
                  me.avatar as avatar ,
                  me.name as member_name
                from pixiv_illust_item it
                   left join pixiv_illust il on(it.illust_id=il.id) 
                   left join pixiv_member me on(me.id=il.member_id) 
                   where it.illust_id=? order by it.name desc
                `;
                let countSql = 'select count(1) as c from pixiv_illust_item where illust_id=?';


                let result = await SqliteUtil.all(db, sql, [me.extraParams.illust_id]);
                let count = await SqliteUtil.all(db, countSql, [me.extraParams.illust_id]);
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
