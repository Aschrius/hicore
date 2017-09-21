"use strict";
try {
    Ext.define('Tool.base.util_node.SqliteUtil', {});
} catch (e) {
}
class SqliteUtil {

    static getConnection(dbPath) {
        return new SqliteUtil.sqlite3.Database(dbPath);
    }

    static run(db, sql, params) {
        return new Promise(function (resolve, reject) {
            db.run(sql, params, function (err, ret) {
                if (err == null) {
                    resolve(ret);
                } else {
                    reject(err);
                }
            });
        });
    }

    static prepare(db, sql) {
        return new Promise(function (resolve, reject) {
            let stmt = db.prepare(sql, function (err) {
                if (err == null) {
                    resolve(stmt);
                } else {
                    reject(err);
                }

            });
        });

    }

    static stmt_finalize(stmt) {

        return new Promise(function (resolve, reject) {
            stmt.finalize(function (err) {
                if (err == null) {
                    resolve(true);
                } else {
                    reject(false);
                }
            })
        });

    }

    static async stmt_run_array(stmt, array) {
        for (let i = 0; i < array.length; i++) {
            await SqliteUtil.stmt_run(stmt, array[i]);
        }
        await SqliteUtil.stmt_finalize(stmt);

    }

    static stmt_run(stmt, params) {
        return new Promise(function (resolve, reject) {
            stmt.run(params, function (err) {
                if (err == null) {
                    resolve(true);
                } else {
                    reject(err);
                }
            });
        });

    }

    static all(db, sql, params) {
        return new Promise(function (resolve, reject) {
            db.all(sql, params, function (err, rows) {
                if (err == null) {
                    resolve(rows);
                } else {
                    reject(err);
                }
            })
        });

    }

    static close(db) {
        if (db != null) {
            db.close();
        }
    }

}
SqliteUtil.sqlite3 = require('sqlite3').verbose();

try{
    exports.SqliteUtil = SqliteUtil;
}catch(e){}

