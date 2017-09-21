Ext.define('Tool.trend.bili.proxy.BiliProxy', {
    extend: 'Ext.data.proxy.Ajax',
    headers: {},
    url: 'http://s.search.bilibili.com/cate/search',
    reader: {
        type: 'json',
        rootProperty: 'result',
        totalProperty: 'numResults',
        successProperty: 'code'
    },
    writer: {
        type: 'json',
    },
    buildUrl: function (req) {
        let me = this;
        let config = req.getConfig();
        let url = me.getUrl(req);
        let reqJson = null;
        try {
            reqJson = JSON.stringify(config.params);
        } catch (e) {

        } finally {
            console.info(req.getAction() + ':url=' + url + '\njson=' + reqJson);
        }
        return url;
    },
    listeners: {
        exception: function (proxy, response, options) {
            let responseData = {};
            let status = response.status;
            if (typeof status == 'undefined' || status == 0) {
                Ext.MessageBox.show({
                    title: '〇',
                    msg: '<span style="color:red;font-weight: bold;">电波传送到了异次元</span>',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            } else {
                try {
                    responseData = proxy.reader.getResponseData(response);
                } catch (e) {
                    console.error(e);
                }


                Ext.MessageBox.show({
                    title: 'Error',
                    msg: '<span style="color: #999">status:' + status + '&nbsp;&nbsp;&nbsp;code:' +
                    responseData.code + '</span><br><span style="color:red;font-weight: bold;">' +
                    responseData.msg + '</span>',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }

        }
    }

});
