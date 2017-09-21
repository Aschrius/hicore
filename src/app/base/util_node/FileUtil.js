"use strict";
try {
    Ext.define('Tool.base.util_node.FileUtil', {});
} catch (e) {
}

class FileUtil {

    static async xml2json(xml) {
        return new Promise(function (resolve, reject) {
            let parseString = require('xml2js').parseString;
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
        let fs = require('fs');
        let node_path = require('path');

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
    };

    static copyFile(srcFile, tarPath) {
        let fs = require('fs');
        let child_process = require('child_process');
        if (!fs.existsSync(srcFile)) {
            alert(srcFile + ":不存在!");
            return false;
        }
        child_process.execSync('copy /y "' + srcFile + '" "' + tarPath + '"');
        return true;
    };

    static async existsAsync(filePath, charset) {
        return new Promise(function (resolve, reject) {
            let fs = require('fs');
            fs.exists(filePath, function (exists) {
                resolve(exists);
            });
        });
    }

    static async writeFileAsync(path, content, charset) {
        return new Promise(function (resolve, reject) {
            let iconv = require('iconv-lite');
            let fs = require('fs');
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
            let fs = require('fs');
            fs.readFile(filePath, function (err, fileContents) {
                if (err) {
                    reject(err);
                    return;
                }
                let iconv = require('iconv-lite');
                let content = iconv.decode(fileContents, charset);
                resolve(content)
            });
        });
    }

    static async parseYmlAsync(filePath, charset) {
        let iconv = require('iconv-lite');
        let yaml = require('js-yaml');

        let content = await FileUtil.readFileAsync(filePath, charset);
        // content = iconv.decode(content, charset);

        let json = yaml.safeLoad(content);
        return json;
    }

    static async parseCsvAsync(filePath, charset, callback) {
        return new Promise(function (resolve, reject) {

            let fs = require('fs');
            let csv_parser = require('csv-parse');
            let iconv = require('iconv-lite');

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
        let yaml = require('js-yaml');
        return yaml.safeDump(json);
    }

    static listFilesSync(path) {
        let fs = require('fs');
        if (fs.existsSync(path)) {
            return fs.readdirSync(path);
        } else {
            return [];
        }
    }

    static async listFiles(path) {
        return new Promise(function (resolve, reject) {
            let fs = require('fs');
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


