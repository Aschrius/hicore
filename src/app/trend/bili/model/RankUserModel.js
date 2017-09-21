"use strict";
Ext.define('Tool.trend.bili.model.RankUserModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'id',
        'username',
        'type',
        'pic',
        'mid',
        'rankId',
        'userId',
    ],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/trend/bili/rank/:rankId/user',
        idArray: ['rankId'],
        reader: {
            type: 'json',
            transform: {
                fn: function (data) {
                    let returnData = null;

                    // 处理数据前的预处理。提取数据给框架用
                    try {
                        let success = data.code == 0;
                        if (Array.isArray(data.data.list)) {
                            data.data.success = success;

                            returnData = data.data;

                            returnData.list.forEach(function (value, index) {

                                returnData.list[index]['type_' + value.type] = 1;

                            });
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
        }
    }),
    proxy_: ExtUtil.getRestModelProxyTpl(AT.apiServer + '/trend/bili/rank/:rankId/user', ['rankId'], {
        reader: {
            type: 'json',
            transform: {
                fn: function (data) {
                    let returnData = null;

                    // 处理数据前的预处理。提取数据给框架用
                    try {
                        let success = data.code == 0;
                        if (Array.isArray(data.data.list)) {
                            data.data.success = success;

                            returnData = data.data;

                            returnData.list.forEach(function (value, index) {

                                returnData.list[index]['type_' + value.type] = 1;

                            });
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
        }
    })
});

