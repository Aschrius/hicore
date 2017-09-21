"use strict";
try {
    Ext.define('Tool.base.util_node.RequestUtil', {});
} catch (e) {
}
class RequestUtil {
    static request(options) {
        return new Promise(function (resolve, reject) {
            require('request')(options, function (error, response, body) {
                if (error == null && response != null && response.statusCode == 200) {
                    resolve(response, body);
                } else {
                    let info = response == null ? '信息被黑洞接收' : response.statusCode;
                    reject(new Error(info));
                }
            });

        });
    }

}
