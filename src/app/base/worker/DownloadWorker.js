//DownloadWorker.js
/**
 * service
 * config{
 *    id
 *    path
 *    url
 *    headers
 *    MAX_BUFFER
 *    THREAD_NUM
 * }
 */
"use strict";

const fs = require('fs');
const querystring = require('querystring');
const _http = require('http');
const _https = require('https');


class DownloadSection {
    constructor(section) {
        let {url, part, method, start, end, buffer, path, headers} = section;
        this._url = url;
        this._part = part;
        this._method = method;
        this._start = start;
        this._end = end;
        this._buffer = buffer;
        this._path = path;

        this._total = end - start;

        this._length = 0;
        this._writeStream = null;
        this._req = null;
        this._resp = null;
        this._headers = headers;
        this._isError = false;
    }

    control() {
        let me = this;
        this._res.on('data', function (chunk) {
            me.res_data_handler(chunk, me);
        });
        this._res.on('error', function (e) {
            me.res_error_handler(e, me);
        });
        this._res.on('end', function () {
            me.res_end_handler(me);
        });
        this._writeStream.on('drain', function () {
            me._res.resume();
        });
    }

    async start() {
        try {
            let me = this;
            let {opts, http} = Download.buildOpts(this._url);
            opts.url = me._url;
            opts.headers = {
                'Range': 'bytes=' + me._start + '-' + me._end,
                'Connection': 'keep-alive'
            };
            for (let k in me._headers) {
                opts.headers[k] = me._headers[k];
            }
            let {res, req} = await Download.doReqAsync(opts);
            me._total = parseInt(res.headers['content-length']);

            me._writeStream = fs.createWriteStream(me._path, {
                bufferSize: me._buffer,
                flags: 'r+',
                start: me._start
            });


            this._res = res;
            this._req = req;
            me.control();
        } catch (e) {
            console.error(e);
        }
    }

    res_data_handler(chunk, me) {
        me._length += chunk.length;
        // console.log(me._part+'-length='+me._length+'-start='+me._start+'-end='+me._end+'--'+(Math.ceil(me._length/(me._end-me._start)*10000)/100));
        if (me._writeStream.write(chunk) === false) {
            me._res.pause();
        }
    }

    res_error_handler(e, me) {
        if (me._writeStream != null)
            me._writeStream.end();
        console.log(e);
        me._isError = true;
    }

    res_end_handler(me) {
        if (me._total === me._length) {
            // TODO
            // console.log(me._part+' success')
            me._writeStream.end();
        } else {
            // console.log(me._part+' - fail:'+me._length+'/'+me._total);
            if (me._writeStream != null)
                me._writeStream.end();
        }
    }


}
class Download {
    constructor(url, path, headers, MAX_BUFFER, THREAD) {
        this._headers = headers;
        this.path = path;
        this.url = url
        this.MAX_BUFFER = MAX_BUFFER;
        this.THREAD = THREAD;
    }

    async start() {
        let me = this;
        let thread = me.THREAD;
        let {statusCode, headers} = await Download.getHeaders(this.url);
        console.log('statusCode=' + statusCode);
        console.log(headers);
        let contentLength = parseInt(headers['content-length'])
        let sections = [];
        // 多个进程下载
        let size = Math.ceil(contentLength / thread) + 1;
        for (let i = 0; i < thread; i++) {
            let start = i * size;
            let end = (i + 1) * size + 1;
            if (i == thread - 1) {
                end = '';
            }
            sections.push({
                path: me.path,
                url: me.url,
                part: i,
                method: 'GET',
                start: start,
                end: end,
                buffer: me.MAX_BUFFER,
                headers: me._headers
            });
        }

        await Download.writeFileAsync(me.path, '');

        me.sections = [];
        sections.forEach(function (section) {
            let ds = new DownloadSection(section);
            me.sections.push(ds);
            ds.start();
        });
    }

    static buildOpts(url) {
        let http = null;
        let reg = new RegExp(/^http:\/\/([^:\/]+)[:]*(\d*)(\/[^$]*)$/);
        let ret = reg.exec(url);
        if (ret == null) {
            reg = new RegExp(/^https:\/\/([^:\/]+)[:]*(\d*)(\/[^$]*)$/);
            ret = reg.exec(url);
            http = _https;
        } else {
            http = _http;
        }
        let opts = {
            hostname: ret[1],
            port: ret[2],
            path: ret[3],
            method: 'GET',
            headers: {}
        };
        return {opts: opts, http: http};
    }

    static async getHeaders(url, method = 'HEAD') {
        return new Promise(function (resolve, reject) {
            let {opts, http} = Download.buildOpts(url);
            opts.method = method;
            let req = http.request(opts, function (res) {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers
                });
            });
            req.on('error', function (e) {
                reject(e);
            });
            req.end();
        })
    }

    static getHttp(url) {
        let http = null;
        let reg = new RegExp(/^http:\/\/([^:\/]+)[:]*(\d*)(\/[^$]*)$/)
        let ret = reg.exec(url);
        if (ret == null) {
            reg = new RegExp(/^https:\/\/([^:\/]+)[:]*(\d*)(\/[^$]*)$/)
            ret = reg.exec(url);
            http = _https;
        } else {
            http = _http;
        }
        return http;

    }

    static async doReqAsync(opts) {
        return new Promise(function (resolve, reject) {
            let http = Download.getHttp(opts.url);
            let req = http.request(opts, function (res) {
                resolve({req: req, res: res})
            });
            req.on('error', function (e) {
                reject(e);
            });
            req.end();
        });
    }

    static async writeFileAsync(path, content) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(path, content, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async postForm(url, json) {
        return new Promise(function (resolve, reject) {
            let contents = querystring.stringify(json);
            var options = {
                host: 'www.joey.com',
                path: '/application/node/post.php',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': contents.length
                }
            };
            var req = http.request(options, function (res) {
                res.setEncoding('uft8');
                resolve({req: req, res: res})
                res.on('data', function (data) {
                    console.log(data);
                });

            });
            req.write(contents);
            req.on('error', function (e) {
                reject(e);
            });
            req.end();

        });
    }
}


class DownloadWorker {
    static add(config) {
        // *    id
        // *    path
        // *    url
        // *    headers
        // *    MAX_BUFFER
        // *    THREAD_NUM

        try {

            let tmpPath = config.path + '.nodeTmp';
            let max_buffer = config.MAX_BUFFER;
            let thread_num = config.THREAD_NUM;
            if (typeof max_buffer == 'undefined') {
                max_buffer = 1024 * 1024;
            }
            if (typeof thread_num == 'undefined') {
                thread_num = 3;
            }

            let dl = new Download(config.url, tmpPath, config.headers, max_buffer, thread_num);

            (async function (dl) {
                try {
                    await dl.start();
                } catch (e) {
                    console.error(e)
                }
            })(dl);


            let intervalId = setInterval(function () {
                try {

                    if (typeof dl.lastLength == 'undefined') {
                        dl.lastLength = 0;
                    }
                    let total = 0;
                    let length = 0;
                    let isError = false;
                    let isAbort = DownloadWorker.abortRef[config.id + ''] == 1;
                    dl.sections.forEach(function (s) {
                        if (isAbort) {
                            try {
                                s._req.abort();
                            } catch (e) {
                                console.error(e);
                            }
                        }

                        total += s._total;
                        length += s._length;
                        if (s._isError == true) {
                            isError = true;
                        }
                    });
                    let speed = parseInt((length - dl.lastLength) / (1024 * 1024) * 100) / 100;
                    dl.lastLength = length;
                    console.log(config.path + ':' + length + '/' + total + '-' + (parseInt(length / total * 10000) / 100) + '% - speed=' + speed + 'M/s');
                    DownloadWorker.report(config.id, length, total, speed);
                    if (length == total) {
                        clearInterval(intervalId);
                        DownloadWorker.removeRef(config.id);
                        DownloadWorker.finish(config.id);
                        fs.rename(tmpPath, config.path, function (e) {
                            if (e) {
                                console.log(e);
                            }
                        });
                    } else if (isError == true || isAbort == true) {
                        clearInterval(intervalId);
                        DownloadWorker.removeRef(config.id);
                        DownloadWorker.error(config.id);
                    }


                } catch (e) {
                    console.log(e)
                    clearInterval(intervalId);
                    DownloadWorker.removeRef(config.id);
                    DownloadWorker.error(config.id);
                }
            }, 1 * 1000);
            DownloadWorker.addRef(config.id, intervalId);


        } catch (e) {
            DownloadWorker.error(config.id);
            console.log(e)
        }
    }

    static addRef(id, intervalId) {
        DownloadWorker.intervalIdRef[id + ''] = intervalId;
    }

    static removeRef(id) {
        delete DownloadWorker.intervalIdRef[id + ''];
        delete DownloadWorker.abortRef[id + ''];
    }

    /**
     * id
     * cursor
     */
    static error(id) {
        process.send({
            service: 'error',
            data: {
                id: id
            }
        });

    }

    static report(id, cursor, total, speed) {
        process.send({
            service: 'report',
            data: {
                id: id,
                cursor: cursor,
                total: total,
                speed: speed
            }
        });
    }

    static finish(id) {
        process.send({
            service: 'finish',
            data: {
                id: id
            }
        });
    }

}
DownloadWorker.intervalIdRef = {};
DownloadWorker.abortRef = {};


process.on('message', function (params) {
    console.log(params);
    try {
        let {service, config} = params;
        switch (service) {
            case 'add':
                DownloadWorker.add(config);
                break;
            case 'abort':
                let id = DownloadWorker.intervalIdRef[config.id + ''];
                if (typeof id != 'undefined') {
                    DownloadWorker.abortRef[config.id + ''] = 1;
                }
                break;
        }

    } catch (e) {
        console.error(e)
    }
});
process.send({
    service: 'info',
    msg: 'DownloadWorker run success!',
    data: {
        id: null
    }
});
process.on('uncaughtException', (reason, p) => {
    console.log("uncaughtException ", p, " reason: ", reason);
});
