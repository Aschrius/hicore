"use strict";

const parseString = require('xml2js').parseString;
const fs = require('fs');
const node_path = require('path');
const child_process = require('child_process');
const iconv = require('iconv-lite');
const yaml = require('js-yaml');
const csv_parser = require('csv-parse');

export class FileUtil {
    static async xml2json(xml) {
        return new Promise(function (resolve, reject) {
            parseString(xml, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static mkdirsSync(dirpath, mode) {

        if (mode == null) mode = {};
        if (!fs.existsSync(dirpath)) {
            let pathtmp;
            dirpath.split(node_path.sep).forEach(function (dirname) {

                if (pathtmp) {
                    pathtmp = node_path.join(pathtmp, dirname);
                }
                else {
                    pathtmp = dirname;
                }
                if (!fs.existsSync(pathtmp)) {
                    if (!fs.mkdirSync(pathtmp, mode)) {
                        return false;
                    }
                }
            });
        }
        return true;
    }


    static copyFile(srcFile, tarPath) {
        if (!fs.existsSync(srcFile)) {
            alert(srcFile + ":不存在!");
            return false;
        }
        child_process.execSync('copy /y "' + srcFile + '" "' + tarPath + '"');
        return true;
    }

    static async existsAsync(filePath, charset) {
        return new Promise(function (resolve, reject) {
            fs.exists(filePath, function (exists) {
                resolve(exists);
            });
        });
    }

    static async writeFileAsync(path, content, charset) {
        return new Promise(function (resolve, reject) {
            if (typeof (charset) != 'undefined')
                content = iconv.encode(content, charset);
            fs.writeFile(path, content, function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    };

    static async readFileAsync(filePath, charset) {
        return new Promise(function (resolve, reject) {
            fs.readFile(filePath, function (err, fileContents) {
                if (err) {
                    reject(err);
                    return;
                }
                let content = iconv.decode(fileContents, charset);
                resolve(content)
            });
        });
    }

    static async parseYmlAsync(filePath, charset) {

        let content = await FileUtil.readFileAsync(filePath, charset);
        // content = iconv.decode(content, charset);

        let json = yaml.safeLoad(content);
        return json;
    }

    static async parseCsvAsync(filePath, charset, callback) {
        return new Promise(function (resolve, reject) {

            fs.readFile(filePath, function (err, fileContents) {
                if (err) {
                    reject(err);
                    return;
                }

                let content = iconv.decode(fileContents, charset);
                csv_parser(content, {columns: true},
                    function (err, output) {
                        if (!err) {
                            resolve(output);
                        } else {
                            reject(err);
                        }
                    }
                );
            });

        });
    }

    static async json2Yml(json) {
        return yaml.safeDump(json);
    }

    static listFilesSync(path) {
        if (fs.existsSync(path)) {
            return fs.readdirSync(path);
        } else {
            return [];
        }
    }

    static async listFiles(path) {
        return new Promise(function (resolve, reject) {
            fs.readdir(path, function (error, files) {
                if (error) {
                    reject(error);
                } else {
                    resolve(files);
                }

            })

        });


    }


}
