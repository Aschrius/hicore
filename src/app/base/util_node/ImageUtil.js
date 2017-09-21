"use strict";
try {
    Ext.define('Tool.base.util_node.ImageUtil', {});
} catch (e) {
}
class ImageUtil {
    static load(src, callback) {
        let img = new Image();
        img.src = src;
        img.onload = function () {
            callback(false, img);
        };
        img.onerror = function () {
            callback(new Error('image load error!'));
        }
    };

    static async loadAsync(src) {
        return new Promise(function (resolve, reject) {
            let img = new Image();
            img.src = src;
            img.onload = function () {
                resolve(img);
            };
            img.onerror = function () {
                reject('image load error!');
            };

        });
    }

    static newCanvas(width, height) {
        let canvas = document.createElement("canvas");
        canvas.setAttribute("width", width + "");
        canvas.setAttribute("height", height + "");
        return {context: canvas.getContext('2d'), canvas: canvas};
    }

    static drawImage(ctx, img, x, y) {
        ctx.drawImage(img, x, y);
    }

    static fillText(ctx, cfg) {
        if (cfg.oc == false) return;
        ctx.font = cfg.font;
        ctx.textBaseline = cfg.textBaseline;
        ctx.textAlign = cfg.textAlign;
        ctx.shadowBlur = cfg.shadowBlur;
        ctx.shadowColor = cfg.shadowColor;
        ctx.strokeStyle = cfg.strokeStyle;
        ctx.lineWidth = cfg.strokeWidth;
        if (
            (cfg.strokeStyle != null) && (cfg.strokeWidth != null)
        ) ctx.strokeText(cfg.text, cfg.x, cfg.y, cfg.maxWidth);

        ctx.fillStyle = cfg.style;
        ctx.fillText(cfg.text, cfg.x, cfg.y, cfg.maxWidth);
    };

    static fillImage(src, tar, x, y) {
        let finImage = src;
        let data = src.data;

        if (
            (tar.width + x <= 0) && (x < 0) ||
            (src.width - x <= 0) && (x > 0) ||
            (tar.height + y <= 0) && (y < 0) ||
            (src.height - y <= 0) && (y > 0)
        ) return src;

        let tarNeedWidth = tar.width;
        if (((src.width - x) < (tar.width)) && (x > 0))// 超出一点
            tarNeedWidth = (src.width - x);

        for (let j = 0; j < tar.height; j++) {

            for (let i = 0; i < (tarNeedWidth * 4); i = i + 4) {
                let index = src.width * 4 * (y + j) + x * 4 + i;
                let tarIndex = tar.width * 4 * j + i;

                let r1 = src.data[index];
                let r2 = tar.data[tarIndex];
                let g1 = src.data[index + 1];
                let g2 = tar.data[tarIndex + 1];
                let b1 = src.data[index + 2];
                let b2 = tar.data[tarIndex + 2];
                let a1 = src.data[index + 3] / 255;
                let a2 = tar.data[tarIndex + 3] / 255;


                let r3 = (r1 * a1 * (1 - a2) + r2 * a2) / (a1 + a2 - a1 * a2);
                let g3 = (g1 * a1 * (1 - a2) + g2 * a2) / (a1 + a2 - a1 * a2);
                let b3 = (b1 * a1 * (1 - a2) + b2 * a2) / (a1 + a2 - a1 * a2);
                let a3 = (a1 + a2 - a1 * a2) * 255;


                finImage.data[index + 0] = r3;
                finImage.data[index + 1] = g3;
                finImage.data[index + 2] = b3;
                finImage.data[index + 3] = a3;

            }
        }

        // for (let i = 0; i < finImage.data.length; i += 4) {
        //     finImage.data[i] = data[i];
        //     finImage.data[i + 1] = data[i + 1];
        //     finImage.data[i + 2] = data[i + 2];
        //     finImage.data[i + 3] = data[i + 3];
        // }

        return finImage;
    };

    static clear(ctx, width, height) {
        let imageData = ctx.createImageData(width, height);
        // 图片背景透明预处理
        let total = width * height * 4;
        for (let i = 0; i < total; i += 4) {
            imageData.data[i + 3] = 0;
        }
        // 绘制到canvas
        ctx.putImageData(imageData, 0, 0);

        let conf = ImageUtil.initFontConfig({text: ""});
        ImageUtil.fillText(ctx, conf);
    };

    static initFontConfig(config) {
        let cfg = {};
        cfg.font = "900 30px Microsoft YaHei";
        cfg.shadowBlur = 0;
        cfg.shadowColor = null;
        cfg.strokeStyle = null;
        cfg.strokeWidth = 0;
        cfg.style = null;
        cfg.text = "CodePlay + 中文测试";
        cfg.textAlign = "left";
        cfg.x = 100;
        cfg.y = 100;
        cfg.maxWidth = 900;
        cfg.textBaseline = "alphabetic";
        cfg.oc = true;

        function init(config) {
            if (config == null)
                cfg.oc = false;
            else
                for (let p in config) {
                    cfg[p] = config[p];
                }
            return cfg;
        }

        cfg = init(config);
        return cfg;

    };

    static savePng(canvas, fileName, callback) {
        // 获取文件流
        let base64Data = canvas.toDataURL("image/png").replace(/^data:image\/\w+;base64,/, "");
        let dataBuffer = new Buffer(base64Data, 'base64');
        // 写出
        let fs = require('fs');
        fs.writeFile(fileName, dataBuffer, function (err) {
            if (err) {
                callback(err, false);
            } else {
                callback(err, true);
            }
        });
    };

    static async savePngAsync(canvas, fileName) {
        return new Promise(function (resolve, reject) {
            let base64Data = canvas.toDataURL("image/png").replace(/^data:image\/\w+;base64,/, "");
            let dataBuffer = new Buffer(base64Data, 'base64');
            let fs = require('fs');
            fs.writeFile(fileName, dataBuffer, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);

                }
            });
        });

    }


}
