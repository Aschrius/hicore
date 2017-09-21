"use strict";

let basePath = process.cwd().replace(/\\/g, '/');
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

let db = null;
try {
    // 初始化db
    SqliteUtil.sqlite3 = require('sqlite3').verbose();
    let dbPath = basePath + '/../conf/trend_bili_snap.sqlite';
    db = SqliteUtil.getConnection(dbPath);

    let sql = 'CREATE TABLE trendBiliSnap ( description TEXT, aid LONG, createDate TIMESTAMP)';
    db.run(sql, [], function (err, ret) {

        if (err != null) {
            process.send(err.message);
        }
        sql = 'CREATE index idx_trendBiliSnap_aid on trendBiliSnap(aid desc)';
        db.run(sql, [], function (err, ret) {
            if (err != null) {
                process.send(err.message);
            }

        });

    });
} catch (e) {
    process.send(e.message);
}


process.on('message', async function (params) {
    try {

        let {aid, description} = params;

        let rows = await SqliteUtil.all(db, 'select * from trendBiliSnap where aid=? order by createDate desc limit 0,1', [aid]);
        let row = null;
        if (rows.length > 0) {
            row = rows[0];
        }

        if (row != null && row.description == description) {
            return;
        }

        let result = await SqliteUtil.run(db, 'insert into trendBiliSnap(aid,description,createDate) values(?,?,?)', [aid, description, new Date()]);
        process.send('snap av' + aid + ' success.');

    } catch (e) {
        process.send(e.message);
        console.log(e);
    }

});
process.send('connenct success!!');



