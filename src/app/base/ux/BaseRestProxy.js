Ext.define('Tool.base.ux.BaseRestProxy', {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.baserestproxy',
    headers: {
        'Authorization': 2131231
    },
    type: 'rest',
    appendId: true,
    actionMethods: {
        create: 'POST',
        read: 'GET',
        update: 'PUT',
        destroy: 'DELETE'
    },
    url: null,
    idArray: [],
    reader: {
        type: 'json',
        transform: {
            fn: function (data) {
                let returnData = null;

                // 处理数据前的预处理。提取数据给框架用
                try {
                    let success = data.code == 0;
                    if (typeof (data.data.children) != 'undefined') {
                        //TODO tree 的 children
                        data.success = success;
                        data.children = data.data.children;
                        returnData = data;
                    } else if (Array.isArray(data.data.list)) {
                        data.data.success = success;
                        returnData = data.data;
                    } else {
                        data.success = success;
                        data.list = data.data;
                        returnData = data;
                    }

                } catch (e) {
                    returnData = data;
                }

                console.info('processJson:');//TODO cs
                console.log(returnData);
                return returnData;

            },
            scope: this
        },
        rootProperty: 'list',
        totalProperty: 'total',//TODO
        successProperty: 'success'
    },
    writer: {
        type: 'json',
        writeAllFields: true // 要开启，否则rest.put 有问题
    },
    getAuthorization: function () {
        const crypto = require('crypto');
        const md5 = crypto.createHash('md5');
        let time = new Date().getTime() + AT.app.time_difference;
        let signStr = AT.app.appKey + '.' + time + '.' + AT.app.appSecret;
        let sign = md5.update(signStr).digest('hex');

        return AT.app.appKey + '.' + time + '.' + sign.toUpperCase();
    },
    buildUrl: function (req) {
        let me = this;

        me.headers = {'Authorization': me.getAuthorization()};


        let config = req.getConfig();
        let operation = req.getOperation();
        let records = operation.getRecords() || [];
        let record = records.length > 0 ? records[0] : null;
        let url = me.getUrl(req);
        let id = null;
        if (typeof (record) != 'undefined' && record != null && typeof (record.id) != 'undefined' && record.id != null && Ext.String.trim(record.id + '') != '') {
            id = record.id;
        } else if (typeof (config.params.id) != 'undefined' || config.params.id != null || Ext.String.trim(config.params.id + '') != '') {
            id = config.params.id;
        }

        if (typeof (id) == 'undefined' || id == null || Ext.String.trim(id + '') == '') {
            id = null;
            try {
                record.set('id', null);
            } catch (e) {
            }
        }


        if (me.isValidId(id)) {
            if (id != null) {
                url = url.replace(':id', id);
            }
            // 替换模板
            for (let i = 0; i < me.idArray.length; i++) {
                // console.log(req.getConfig().params)
                // console.log(config.params)
                url = url.replace(':' + me.idArray[i], req.getConfig().params[me.idArray[i]]);
            }
        } else {
            console.log('getRestModelProxyTpl:id=' + id);
            throw new Error('A valid id is required');
        }
        if (this.appendId == true && me.isValidId(id) && id != null && req.getAction() != 'create') {
            url += '/' + encodeURIComponent(id);
        }


        let reqJson = null;
        try {
            reqJson = JSON.stringify(config.params);
        } catch (e) {

        } finally {
            console.info(req.getAction() + ':id=' + id + ':url=' + url + '\njson=' + reqJson);
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
    },
    isValidId: function (id) {
        return id == null ? true : (/^\d+$/.test(id) ? true : false);
    }

});
