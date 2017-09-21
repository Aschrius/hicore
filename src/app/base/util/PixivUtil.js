"use strict";
try {
    Ext.define('Tool.base.util.PixivUtil', {});
} catch (e) {
    console.log(e)
}

class PixivUtil {
    static async analyseMember(member_id) {

        let total = 0;
        let datas = [];
        let message = null;
        let success = true;
        let avatar_url = null;
        let avatar = null;
        let member_name = null;
        let illust_ids = [];
        try {
            let reg_total = new RegExp('count-badge">(\\d+)', 'g'),
                reg_size = new RegExp('_thumbnail', 'g'),
                reg_avatar_url = new RegExp('<img src="([^"]+)" alt="" class="user-image">', 'g'),
                reg_member_name = new RegExp('<h1 class="user">([^<]+)</h1>', 'g'),
                reg_illust_ids_pre = new RegExp('image-item"><a href="/member_illust.php\\?mode=medium&illust_id=(\\d+)', 'g'),
                reg_illust_cover = new RegExp('lazy-image"data-src="([^"]+)"data-type', 'g'),
                reg_illust_title = new RegExp('<h1 class="title" title="([^"]+)">', 'g');

            let arr = reg_total.exec(html);
            total = parseInt(arr[1]);
            let size = html.match(reg_size).length;
            let totalPage = total % size == 0 ? total / size : Math.floor(total / size) + 1;


            avatar_url = (reg_avatar_url.exec(html))[1];

            avatar = avatar_url.match(/[^\\.]+$/g)[0];

            member_name = (reg_member_name.exec(html))[1];


            let illust_ids_pre = html.match(reg_illust_ids_pre);
            illust_ids = illust_ids_pre.join('_').match(/\d+/g);
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
            illust_ids: illust_ids,
            member_name: member_name,
            avatar: avatar,
            avatar_url: avatar_url,
            metaData: {}
        }

    }

    static async analyseIllust(illust_id) {

        let PIXIV_URL = 'https://www.pixiv.net/';
        let message = null;
        let success = true;
        let title = null;
        let imageUrls = [];
        let type = -1;
        let createdDate = null;
        try {

            let reg_title = new RegExp('</ul><h1 class="title">([^<]+)</h1>', 'g'),
                reg_createdDate = new RegExp('<ul class="meta"><li>([^<]+)</li>', 'g');

            let html = null;
            let url = 'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + illust_id;
            let result = await ExtUtil.ajaxAsync(url, 'GET', {}, {});
            if (!(result && result.status == 200)) {
                throw new Error(result.status);
            }
            html = result.responseText;


            title = reg_title.exec(html);
            if (title != null) {
                title = title[1];
            } else {
                reg_title = new RegExp('<h1 class="title">([^<]+)</h1><div class="ui-expander-container">', 'g')
                title = reg_title.exec(html)[1];
            }


            let createdDateStr = reg_createdDate.exec(html);
            createdDateStr = createdDateStr[1];

            let temp_date = createdDateStr.match(/\d+/g);
            createdDate = new Date(temp_date[1] + ' ' + temp_date[2] + ',' + temp_date[0] + ' ' + temp_date[3] + ':' + temp_date[4]);

            let typeFeatureStr = html.match(/pixiv.tracking.URL = "[^"<>;]+"/)[0];

            // 判断作品类型
            if (typeFeatureStr.indexOf("manga") != -1 && typeFeatureStr.indexOf("multi") != -1) {
                message = '特殊多图2';
                type = 2;

                let url = 'https://www.pixiv.net/member_illust.php?mode=manga&illust_id=' + illust_id;
                let result = await ExtUtil.ajaxAsync(url, 'GET', {}, {});
                if (!(result && result.status == 200)) {
                    throw new Error(result.status);
                }

                let reg_img_big_url = new RegExp('"([^"]+)" target="_blank" class="full-size-container', 'g');
                let bigImageUrls = result.responseText.match(reg_img_big_url)

                if (bigImageUrls != null) {

                    for (let i = 0; i < bigImageUrls.length; i++) {
                        url = bigImageUrls[i];

                        reg_img_big_url = new RegExp('"([^"]+)" target="_blank" class="full-size-container', 'g');
                        url = reg_img_big_url.exec(url)[1]
                        url = url.replace(/amp;/g, '');
                        url = PIXIV_URL + url;

                        let result = await ExtUtil.ajaxAsync(url, 'GET', {}, {});
                        if (!(result && result.status == 200)) {
                            throw new Error(result.status);
                        }


                        let reg_img = new RegExp('<body><img src="([^"]+)', 'g');
                        let imageUrl = (reg_img.exec(result.responseText))[1];
                        imageUrl = imageUrl.replace(/\\\//g, '/');
                        imageUrls.push(imageUrl);

                    }
                } else {
                    reg_img_big_url = new RegExp('originalImages\\[\\d+\\] = "([^"]+)"', 'g');
                    let bigImageUrls_ = result.responseText.match(reg_img_big_url)
                    bigImageUrls = [];
                    bigImageUrls_.forEach(function (val) {
                        reg_img_big_url = new RegExp('originalImages\\[\\d+\\] = "([^"]+)"', 'g');
                        bigImageUrls.push(reg_img_big_url.exec(val)[1])

                    });

                    for (let i = 0; i < bigImageUrls.length; i++) {
                        url = bigImageUrls[i];
                        url = url.replace(/amp;/g, '');
                        url = url.replace(/\\\//g, '/');
                        imageUrls.push(url);

                    }

                }


            } else if (typeFeatureStr.indexOf("manga") != -1 && typeFeatureStr.indexOf("multi") == -1) {
                // 特殊多图
                message = '特殊多图';
                type = 2;

                let url = 'https://www.pixiv.net/member_illust.php?mode=big&illust_id=' + illust_id;
                let result = await ExtUtil.ajaxAsync(url, 'GET', {}, {});

                if (!(result && result.status == 200)) {
                    throw new Error(result.status);
                }


                let reg_img = new RegExp('<body><img src="([^"]+)', 'g');
                let imageUrl = (reg_img.exec(result.responseText))[1];
                imageUrl = imageUrl.replace(/\\\//g, '/');
                imageUrls.push(imageUrl);


            } else if (typeFeatureStr.indexOf("multi") != -1) {
                // 多图
                message = '多图';
                type = 2;

                let reg_muti_step_1 = new RegExp('<div class="works_display"><a href="([^"]+)', 'g');
                let reg_muti_step_2 = new RegExp('([^"]+)";pixiv.context.thumbnailImages', 'g');


                let url = PIXIV_URL + (reg_muti_step_1.exec(html))[1];
                url = url.replace(/amp;/g, '');
                let result = await ExtUtil.ajaxAsync(url, 'GET', {}, {});
                if (!(result && result.status == 200)) {
                    throw new Error(result.status);
                }
                let illust_mult_pre = result.responseText.match(reg_muti_step_2);
                for (let j = 0; j < illust_mult_pre.length; j++) {
                    let reg_muti_step_2 = new RegExp('([^"]+)";pixiv.context.thumbnailImages', 'g');

                    let re = reg_muti_step_2.exec(illust_mult_pre[j]);
                    let imageUrl = re[1];
                    imageUrl = imageUrl.replace(/\\\//g, '/');
                    imageUrls.push(imageUrl);
                }


            } else if (typeFeatureStr.indexOf("ugoira") != -1) {
                // zip
                message = 'zip';
                type = 3;

                let reg_zip = new RegExp('pixiv.context.ugokuIllustFullscreenData\\s*=\\s*{"src":"([^"]+)"', 'g')

                let imageUrl = (reg_zip.exec(html))[1];
                imageUrl = imageUrl.replace(/\\\//g, '/');
                imageUrls.push(imageUrl);

            } else if (typeFeatureStr.indexOf('illust') != -1) {
                // 单图
                message = '单图';
                type = 1;

                let reg_single = new RegExp('data-src="([^<>]+)" class="original-image"', 'g');

                let imageUrl = (reg_single.exec(html))[1];
                imageUrl = imageUrl.replace(/\\\//g, '/');
                imageUrls.push(imageUrl);

            } else {
                type = -1;
            }


        } catch (e) {
            console.error(e);
            console.error(illust_id);
            message = e.message;
            success = false;
        }

        return {
            illust_id: illust_id,
            imageUrls: imageUrls,
            type: type,
            create_date: createdDate,
            title: title,
            success: success,
            message: message
        }

    }

}
