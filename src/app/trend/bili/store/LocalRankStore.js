/**
 * 样例用
 */
Ext.define('Tool.trend.bili.store.LocalRankStore', {
    requires: [
        'Tool.base.ux.HandleProxy'
    ],
    autoLoad: false,
    extend: 'Ext.data.Store',
    storeId: 'trend-bili_local-rank-store',
    fields: [
        'id',
        'name',
        'tid',
        'expressions',
        'parts',
    ],
    pageSize: 20,
    proxy: {
        autoLoad: false,
        type: 'handleproxy',
        reader: {type: 'json'},
        enablePaging: true,
        handle: async function (opts, fn) {
            try {

                let db = AT.cache.nedb.trend_bili;
                let ranks = await NedbUtil.find(db, {'_id': 'rank'});

                let limit = 100;
                let total = ranks.length;
                let fn_result = {total: total, limit: limit, data: ranks[0].items};
                fn(fn_result);

            } catch (e) {
                console.log(e)
            }


        }
    }
});
