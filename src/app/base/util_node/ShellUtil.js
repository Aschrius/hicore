"use strict";
try {
    Ext.define('Tool.base.util_node.ShellUtil', {});
} catch (e) {
}

class ShellUtil {
    static async execute(shellPath, shell, dataCallback) {
        return new Promise(function (resolve, reject) {

            let fs = require('fs');
            let child_process = require('child_process');
            let iconv = require('iconv-lite');
            fs.writeFileSync(shellPath, iconv.encode(shell, 'GBK'));

            let command = "cmd";
            let args = ['/s', '/c', shellPath];

            let result = '';
            let error = '';

            let ls = child_process.spawn(command, args, {
                cwd: AT.app.path
            });
            ls.on('close', function () {
                fs.unlink(shellPath, function () {
                    if (error == '') {
                        resolve(result);
                    } else {
                        reject(new Error(error));
                    }

                });
            });
            ls.stderr.on('data', function (msg) {
                msg = iconv.decode(msg, 'gbk');
                error += msg;
                if (typeof dataCallback == 'function')
                    dataCallback(msg);
            });

            ls.stdout.on('data', function (msg) {
                msg = iconv.decode(msg, 'gbk');
                result += msg;
                if (typeof dataCallback == 'function')
                    dataCallback(msg);
            });
        });

    };

}
