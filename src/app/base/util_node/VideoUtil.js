Ext.define('Tool.base.util_node.VideoUtil', {});
class VideoUtil {
    static async analyzeAsync(videoPath) {
        return new Promise(function (resolve, reject) {
            VideoUtil.ffmpeg.ffprobe(videoPath, function (err, metadata) {
                if (err) {
                    reject(err);
                } else {
                    resolve(metadata);
                }
            });
        });
    }

}
VideoUtil.ffmpeg = require('fluent-ffmpeg');
VideoUtil.ffmpeg_exePath = __dirname + (AT.isAsar ? '/..' : '') + '\\..\\exec_modules\\ffmpeg\\';
VideoUtil.ffmpeg.setFfmpegPath(VideoUtil.ffmpeg_exePath + "ffmpeg.exe");
VideoUtil.ffmpeg.setFfprobePath(VideoUtil.ffmpeg_exePath + "ffprobe.exe");
VideoUtil.ffmpeg.setFlvtoolPath(VideoUtil.ffmpeg_exePath + "ffplay.exe");
