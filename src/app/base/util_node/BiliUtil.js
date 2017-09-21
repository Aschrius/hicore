"use strict";
/**
 * bilibili解析工具
 */

try {
    Ext.define('Tool.base.util_node.BiliUtil', {});
} catch (e) {
}

class BiliUtil {


    /**
     * 解析content
     * @param content
     * @returns {{totalPage: jQuery, list: Array}}
     */
    static analyzePage(content) {
        let cheerio = require('cheerio');
        let videos = [];
        let $ = cheerio.load(content);
        let totalPage = $('a[class="p endPage"]').text();
        $('div[class=l-item]').each(function (i, ele) {
            let title = $(ele).find('a[class=title]').attr('title');
            let pic = $(ele).find('img[data-img]').attr('data-img');
            let aid = $(ele).find('a[class="preview cover-preview"]').attr('href').match(/\d+/)[0];
            let desc = $(ele).find('div[class=v-desc]').text();
            let play = $(ele).find('span[class="v-info-i gk"]').text();
            let videoReview = $(ele).find('span[class="v-info-i dm"]').text();
            let favorites = $(ele).find('span[class="v-info-i sc"]').text();
            let author = $(ele).find('a[class="v-author"]').attr('title');
            let mid = $(ele).find('a[class="v-author"]').attr('href').match(/com\/(\d+)/)[1];
            let createdDate = $(ele).find('span[class="v-date"]').text();

            videos.push({
                author: author,
                pic: pic,
                aid: aid,
                title: title,
                desc: desc,
                play: play,
                videoReview: videoReview,
                favorites: favorites,
                mid: mid,
                createdDate: createdDate
            });
        });
        return {totalPage: totalPage, list: videos};

    };

    static async analyzeAidAsync(aid) {
        let cookie = '';
        cookie = localStorage.getItem(BiliUtil.local_cookie_key);
        cookie = JSON.parse(cookie);

        let options = {
            url: 'http://www.bilibili.com/video/av' + aid + '/',
            headers: {
                'Referer': 'http://www.bilibili.com',
                'Cookie': cookie
            },
            gzip: true,
        };
        let result = await RequestUtil.request(options);

        if (result[0].statusCode != 200)
            throw new Error('获取失败');

        let cheerio = require('cheerio');
        let $ = cheerio.load(result[1]);
        let video = {
            aid: aid,
            title: $('div[class="v-title"]').text(),
            createdDate: $('time[itemprop="startDate"]').text(),
            mid: $('div[mid]').attr('mid'),
            author: $('meta[name="author"]').attr('content'),
            desc: $('div[id="v_desc"]').text(),
            pic: $('meta[itemprop="thumbnailUrl"]').attr('content'),
            tid: result[1].match(/typeid=(\d+)/)[1]
        };


        let reg_pages = new RegExp(/totalpage = '(\d+)'/);
        let reg_array = reg_pages.exec(result[1]);
        let pages = parseInt(reg_array[1]);
        video.pages = pages;

        return video;
    };

    static async analyzePageAsync(tid, page, date, order_type, original) {
        if (typeof (order_type) == 'undefined' || order_type == null) {
            order_type = 'default';
        }
        if (typeof (date) == 'undefined' || date == null) {
            date = '2010-01-01~2020-01-01';
        }
        if (original == true) {
            original = '-original';
        } else {
            original = '';
        }

        let url = 'http://www.bilibili.com/list/' + order_type + '-' + tid + '-' + page + '-' + date + original + '.html';
        console.log(url)
        let options = {
            url: url,
            headers: {
                'Referer': 'http://www.bilibili.com'
                // 'Cookie': localStorage.getItem('bili_cookie')
            }
        };

        let result = await RequestUtil.request(options);
        if (result.statusCode == 200) {
            let ret = BiliUtil.analyzePage(result.body);
            result = ret;
        } else {
            throw new Error('bilibili数据获取失败!');
        }

        return result;
    }


}
BiliUtil.local_cookie_key = 'rank.bili.login.info';


