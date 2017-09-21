"use strict";
try {
    Ext.define('Tool.base.util_node.ElectronUtil', {});
} catch (e) {
}
class ElectronUtil {

    static async executeJavaScript(webview, code) {
        return new Promise(function (resolve, reject) {
            webview.executeJavaScript(code, false, function (result) {
                resolve(result);
            });
        });
    }

}


