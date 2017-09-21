"use strict";
try {
    Ext.define('Tool.base.util_node.NedbUtil', {});
} catch (e) {
}
class NedbUtil {

    static getConnection(dbPath) {
        return new NedbUtil.Datastore({filename: dbPath, autoload: true});
    }

    static insert(db, doc) {
        return new Promise(function (resolve, reject) {
            try {
                db.insert(doc, function (err) {
                    if (err == null) {
                        resolve(true);
                    } else {
                        reject(err);
                    }

                });
            } catch (e) {
                reject(e);
            }
        });
    }

    static find(db, params) {
        return new Promise(function (resolve, reject) {
            try {
                db.find(params, function (err, data) {
                    if (err == null) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    static findAndSortCo(db, params, sortParams) {
        return new Promise(function (resolve, reject) {
            db.find(params).sort(sortParams).exec(function (err, data) {
                if (err == null) {
                    resolve(data);
                } else {
                    reject(err);
                }
            });
        });
    }

    static update(db, query, update, options) {
        return new Promise(function (resolve, reject) {
            db.update(query, update, options, function (err, numReplaced) {
                if (err != null) {
                    reject(err);
                } else {
                    resolve(numReplaced);
                }

            });

        });

    }


}
NedbUtil.Datastore = require('nedb');


