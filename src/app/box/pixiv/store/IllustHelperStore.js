Ext.define('Tool.box.pixiv.store.IllustHelperStore', {
    extend: 'Ext.data.Store',
    storeId: 'box-pixiv_illust-hepler-store',
    requires: [
        'Tool.base.ux.HandleProxy',
    ],
    statics: {},
    fields: [],
    proxy: {
        type: 'handleproxy',
        reader: {type: 'json'},
        enablePaging: false,
        handle: async function (opts, fn) {
            let me = this;

            let total = 0, limit = 20, data = [];
            try {
                me.extraParams.mask.setLoading('正在操作');

                let page = opts.start / opts.limit + 1;
                let url = 'https://www.pixiv.net/member_illust.php?id=' + me.extraParams.id + '&type=all&p=' + page;
                let result = await ExtUtil.ajaxAsync(url, 'GET', {}, {});
                if (result && result.status == 200) {

                    let ret = me.anaData(result.responseText);
                    if (ret.success != true) {
                        throw new Error(ret.message);
                    }


                    let totalPage = parseInt(Math.ceil(ret.total / ret.data.length));

                    total = ret.total;
                    limit = ret.data.length;
                    data = ret.data;
                    if (totalPage == 1) {


                        let fn_result = {total: total, limit: limit, data: data};
                        fn(fn_result);
                        return;
                    }
                    for (let cursor = 2; cursor <= totalPage; cursor++) {
                        let url = 'https://www.pixiv.net/member_illust.php?id=' + me.extraParams.id + '&type=all&p=' + cursor;
                        let result = await ExtUtil.ajaxAsync(url, 'GET', {}, {});
                        let ret = me.anaData(result.responseText);
                        if (ret.success != true) {
                            throw new Error(ret.message);
                        }
                        total = ret.total;
                        limit += ret.data.length;
                        data = data.concat(ret.data);

                        me.extraParams.mask.setLoading('解析作品页(' + cursor + '/' + totalPage + ')');
                    }


                } else {
                    console.error(result);
                }

            } catch (e) {
                console.error(e);
            } finally {
                me.extraParams.mask.setLoading(false);
            }
            let fn_result = {total: total, limit: limit, data: data};
            fn(fn_result);
        },
        anaData: function (html) {
            let me = this;
            // let Reader = Tool.box.pixiv.store.IllustHelperStore;
            // let reg_total = Reader.reg_total;
            // let reg_size = Reader.reg_size;
            // let reg_avatar_url = Reader.reg_avatar_url;
            // let reg_member_name = Reader.reg_member_name;
            // let reg_illust_ids_pre = Reader.reg_illust_ids_pre;
            // let reg_illust_cover = Reader.reg_illust_cover;
            // let reg_illust_title = Reader.reg_illust_title;
            let reg_total = new RegExp('count-badge">(\\d+)', 'g'),
                reg_size = new RegExp('_thumbnail', 'g'),
                reg_avatar_url = new RegExp('url\\(\'([^"]+)\'\\);"></a><a href="/member.php', 'g'),
                reg_member_name = new RegExp('cover-texture"title="([^"]+)"style', 'g'),
                reg_illust_ids_pre = new RegExp('image-item"><a href="/member_illust.php\\?mode=medium&amp;illust_id=(\\d+)', 'g'),
                reg_illust_cover = new RegExp('lazy-image"data-src="([^"]+)"data-type', 'g'),
                reg_illust_title = new RegExp('<h1 class="title" title="([^"]+)">', 'g');

            let total = 0;
            let datas = [];
            let message = null;
            let success = true;
            try {
                let arr = reg_total.exec(html);
                total = parseInt(arr[1]);
                let size = html.match(reg_size).length;
                let totalPage = total % size == 0 ? total / size : Math.floor(total / size) + 1;


                let avatar_url = (reg_avatar_url.exec(html))[1];

                let avatar = avatar_url.match(/[^\/]+$/g)[0];

                let member_name = (reg_member_name.exec(html))[1];

                me.extraParams.total = total;
                me.extraParams.avatar = avatar;
                me.extraParams.avatar_url = avatar_url;
                me.extraParams.member_name = member_name;
                me.extraParams.total = total;

                let illust_ids_pre = html.match(reg_illust_ids_pre);
                let illust_ids = illust_ids_pre.join('_').match(/\d+/g);
                illust_ids = illust_ids;

                let covers_pre = html.match(reg_illust_cover);
                let covers = covers_pre.join('_').match(/https:\/\/[^"]+/g);

                let titles = [];
                let r = '';
                while (r = reg_illust_title.exec(html)) {
                    titles.push(r[1]);
                }

                titles.forEach(function (value, i) {
                    datas.push({
                        title: titles[i],
                        illust_id: parseInt(illust_ids[i]),
                        id: parseInt(illust_ids[i]),
                        cover: covers[i]
                    });
                });


            } catch (e) {
                console.error(e);
                message = e.message;
                success = false;
            }

            return {
                total: total,
                data: datas,
                success: success,
                message: message,
                metaData: {}
            }

        }
    }
});
