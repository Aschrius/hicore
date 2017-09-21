Ext.define('Tool.box.pixiv.store.IllustItemHelperStore', {
    extend: 'Ext.data.Store',
    storeId: 'box-pixiv_illust-item-hepler-store',
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
                // me.extraParams.mask.setLoading('正在操作');

                let page = opts.start / opts.limit + 1;

                let url = 'https://www.pixiv.net/member_illust.php?mode=medium&amp;illust_id=' + me.extraParams.illust_id;
                let result = await ExtUtil.ajaxAsync(url, 'GET', {}, {});
                if (result && result.status == 200) {

                    let ret = await me.anaData(result.responseText);
                    if (ret.success != true) {
                        throw new Error(ret.message);
                    }


                    let totalPage = parseInt(Math.ceil(ret.total / ret.data.length));

                    total = ret.total;
                    limit = ret.data.length;
                    data = ret.data;

                } else {
                    console.error(result);
                }

            } catch (e) {
                console.error(e);
            } finally {
                // me.extraParams.mask.setLoading(false);
            }
            let fn_result = {total: total, limit: limit, data: data};
            fn(fn_result);
        },
        anaData: async function (html) {
            let me = this;

            let reg_title = new RegExp('</ul><h1 class="title">([^<]+)</h1>', 'g'),//<h1 class="title">最後の花火</h1>
                reg_createdDate = new RegExp('<ul class="meta"><li>([^<]+)</li>', 'g');


            let total = 0;
            let datas = [];
            let message = null;
            let success = true;
            try {

                let title = reg_title.exec(html);
                title = title[1];

                let createdDateStr = reg_createdDate.exec(html);
                createdDateStr = createdDateStr[1];

                let temp_date = createdDateStr.match(/\d+/g);
                let createdDate = new Date(temp_date[1] + ' ' + temp_date[2] + ',' + temp_date[0] + ' ' + temp_date[3] + ':' + temp_date[4]);
                let type = -1;

                let typeFeatureStr = html.match(/pixiv.tracking.URL = "[^"<>;]+"/)[0];
                let imageUrls = [];


                // 判断作品类型
                if (typeFeatureStr.indexOf("manga") != -1 && typeFeatureStr.indexOf("multi") == -1) {
                    // 特殊多图
                    type = 2;

                    let url = 'http://www.pixiv.net/member_illust.php?mode=big&illust_id=' + me.extraParams.illust_id;
                    let result = await ExtUtil.ajaxAsync(url, 'GET', {}, {});
                    if (result && result.status == 200) {


                        let reg_img = new RegExp('<body><img src="([^"]+)', 'g');
                        let imageUrl = (reg_img.exec(result.responseText))[1];
                        imageUrl = imageUrl.replace(/\\\//g, '/');
                        imageUrls.push(imageUrl);

                    } else {
                        console.error(result);
                    }


                } else if (typeFeatureStr.indexOf("multi") != -1) {
                    // 多图
                    type = 2;

                    let reg_muti_step_1 = new RegExp('<div class="works_display"><a href="([^"]+)', 'g');
                    let reg_muti_step_2 = new RegExp('([^"]+)";pixiv.context.thumbnailImages', 'g');


                    let url = 'https://www.pixiv.net/' + (reg_muti_step_1.exec(html))[1];
                    let result = await ExtUtil.ajaxAsync(url, 'GET', {}, {});
                    if (result && result.status == 200) {
                        let illust_mult_pre = result.responseText.match(reg_muti_step_2);
                        for (let j = 0; j < illust_mult_pre.length; j++) {
                            let reg_muti_step_2 = new RegExp('([^"]+)";pixiv.context.thumbnailImages', 'g');

                            let re = reg_muti_step_2.exec(illust_mult_pre[j]);
                            let imageUrl = re[1];
                            imageUrl = imageUrl.replace(/\\\//g, '/');
                            imageUrls.push(imageUrl);
                        }

                    } else {
                        console.error(result)
                    }


                } else if (typeFeatureStr.indexOf("ugoira") != -1) {
                    // zip
                    type = 3;

                    let reg_zip = new RegExp('pixiv.context.ugokuIllustFullscreenData\\s*=\\s*{"src":"([^"]+)"', 'g')

                    let imageUrl = (reg_zip.exec(html))[1];
                    imageUrl = imageUrl.replace(/\\\//g, '/');
                    imageUrls.push(imageUrl);

                } else if (typeFeatureStr.indexOf('illust') != -1) {
                    // 单图

                    type = 1;

                    let reg_single = new RegExp('data-src="([^<>]+)" class="original-image"', 'g');

                    let imageUrl = (reg_single.exec(html))[1];
                    imageUrl = imageUrl.replace(/\\\//g, '/');
                    imageUrls.push(imageUrl);

                } else {
                    type = -1;
                }

                total = imageUrls.length;
                datas = imageUrls;
                me.extraParams.total = total;
                me.extraParams.type = type;
                me.extraParams.title = title;
                me.extraParams.createdDate = createdDate;


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
