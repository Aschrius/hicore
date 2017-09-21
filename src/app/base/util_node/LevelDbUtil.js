"use strict";
try {
    Ext.define('Tool.base.util_node.LevelDbUtil', {});
} catch (e) {
}
class LevelDbUtil {

    static getConnection(dbPath) {
        return LevelDbUtil.level(dbPath);
    }

    static async put(db, key, value) {
        return new Promise(function (resolve, reject) {
            db.put(key, value, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async get(db, key) {
        return new Promise(function (resolve, reject) {
            db.get(key, function (err, value) {
                if (err) {
                    reject(err);
                } else {
                    resolve(value);
                }
            });
        });
    }

    static async del(db, key) {
        return new Promise(function (resolve, reject) {
            db.del(key, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        });
    }


}
LevelDbUtil.level = require('level');


