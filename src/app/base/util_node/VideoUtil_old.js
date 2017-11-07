function VideoUtil() {

    var me = this;

    var fs = require('fs');
    var http = require('http');
    var ffmpeg = require(window['_proPath'] + 'assets/lib/node/fluent-ffmpeg');
    var ffmpeg_exePath = window['_proPath'] + 'assets/script/ffmpeg/';
    var avs_filter_path = window['_proPath'] + 'assets/script/avsfilter/';
    var proPath = window['_proPath'];



    // 默认视频参数
    var videoConfig = {
        frameRate: 30,
        width: 936,
        height: 526,
        videoRate: 670,
        audioRate: 320
    };

    this.analyze = function(videoPath, callback) {

        var me = this;
        ffmpeg.setFfmpegPath(ffmpeg_exePath + "ffmpeg.exe");
        ffmpeg.setFfprobePath(ffmpeg_exePath + "ffprobe.exe");
        ffmpeg.setFlvtoolPath(ffmpeg_exePath + "ffplay.exe");
        ffmpeg.ffprobe(videoPath, function(err, metadata) {
            callback(err, metadata);
        });
    };
    this.analyzeCo = function(videoPath) {
        var me = this;
        return function(callback) {
            me.analyze(videoPath, callback);
        }

    };



    /**
    * 制作yaml
    * list={rank,name,length,offset}
    */
    this.makeYamlScript = function(list) {
        var yamlTemp = "---\r\n";
        for (var i = list.length - 1; i >= 0; i--) {
            yamlTemp += "- :rank: " + list[i]["rank"] + "\r\n";
            yamlTemp += "  :name: av" + list[i]["aid"] + "\r\n";
            yamlTemp += "  :length: " + (typeof(list[i]["length"])=='undefined'?15:list[i]["length"]) + "\r\n";
            yamlTemp += "  :offset: " + (typeof(list[i]["offset"])=='undefined'?0:list[i]["offset"]) + "\r\n";
        }
        return yamlTemp;
    };
    this.makeYamlScriptTop3 = function(list) {
        var yamlTemp = "---\r\n";
        for (var i = list.length - 1; i >= 0; i--) {
            yamlTemp += "- :rank: " + list[i]["rank"] + "\r\n";
            yamlTemp += "  :name: av" + list[i]["aid"] + "\r\n";
            yamlTemp += "  :score_length: 10\r\n";
            yamlTemp += "  :model_length: 10\r\n";
            yamlTemp += "  :logo_length: 60\r\n";
            yamlTemp += "  :offset: 0\r\n";
        }
        return yamlTemp;
    };


    this.makeAvsScript = function(videoMsg, config) {


        var name = videoMsg.name;
        var height = videoMsg.height;
        var width = videoMsg.width;
        var offset = videoMsg.offset;
        var length = videoMsg._length;
        var no_pause_in = videoMsg.no_pause_in;
        var no_pause_out = videoMsg.no_pause_out;

        var avsStr = "#w=" + width + ",h=" + height + "," + (((height / width) <= (526 / 936))) + "\r\n";
        avsStr += 'LoadPlugin("' + avs_filter_path + 'VSFilter.DLL")\r\n';
        avsStr += 'LoadPlugin("' + avs_filter_path + 'LSMASHSource.DLL")\r\n';
        avsStr += 'LoadPlugin("' + avs_filter_path + 'ffms2.dll")\r\n';
        avsStr += 'import("' + avs_filter_path + 'ffms2.avsi")\r\n';

        avsStr += 'offset=' + offset + '\r\n';
        avsStr += 'length=' + length + '\r\n';
        avsStr += 'VideoPath="' + proPath + 'video/' + name + '.flv"\r\n';
        avsStr += 'PicPath="' + proPath + 'list/' + name + '.png"\r\n';
        avsStr += 'FFIndex(VideoPath)\r\n';
        avsStr += 'v=AudioDub(FFVideoSource(VideoPath), FFAudioSource(VideoPath)).convertfps(' + config.frameRate + ').ResampleAudio(44100).Normalize()\r\n';

        var border_LR = 0;
        var border_TB = 0;

        if ((width / height) == (config.width / config.height)) {
            border_LR = 0;
            border_TB = 0;
        } else if ((height / width) < (config.height / config.width)) {// 上下
            border_TB = Math.round((width / config.width * config.height - height) / 2);
        } else if ((height / width) > (config.height / config.width)) {
            border_LR = Math.round((height / config.height * config.width - width) / 2);
        }

        avsStr += 'border_LR=' + ((border_LR%2)==0?border_LR:(border_LR+1)) + '\r\n';
        avsStr += 'border_TB=' + ((border_TB%2)==0?border_TB:(border_TB+1)) + '\r\n';
        avsStr += 'Lanczos4Resize(AddBorders(v,border_LR,border_TB,border_LR,border_TB,color=$000000),' + config.width + "," + config.height + ')\r\n';

        avsStr += 'ConvertToRGB32()\r\n';
        avsStr += 'img=ImageSource(PicPath,pixel_type="rgb32").LanczosResize(' + config.width + "," + config.height + ')\r\n';
        avsStr += 'Layer(img,x=0,y=0)\r\n';
        avsStr += 'offset = offset * 30\r\n';
        avsStr += 'endset = offset + length *30\r\n';
        avsStr += 'Trim(offset,endset)\r\n';

        if (no_pause_out == null || no_pause_out == false)
            avsStr += 'FadeOut(10)\r\n';
        
        
        if (no_pause_in == null || no_pause_in == false)
            avsStr += 'FadeIn(10)\r\n';
        
        return avsStr;
    };

    this.makeAvsScriptTop3 = function(videoMsg,config) {


        var name            = videoMsg.name;
        var height          = videoMsg.height;
        var width           = videoMsg.width;
        var offset          = videoMsg.offset;
        var model_length    = videoMsg.model_length;
        var score_length    = videoMsg.score_length;
        var logo_length     = videoMsg.logo_length;

        var no_pause_in     = videoMsg.no_pause_in;
        var no_pause_out    = videoMsg.no_pause_out;


        var avsStr = "#w=" + width + ",h=" + height + "," + (((height / width) <= (526 / 936))) + "\r\n";

        avsStr += 'LoadPlugin("' + avs_filter_path + 'VSFilter.DLL")\r\n';
        avsStr += 'LoadPlugin("' + avs_filter_path + 'LSMASHSource.DLL")\r\n';
        avsStr += 'LoadPlugin("' + avs_filter_path + 'ffms2.dll")\r\n';
        avsStr += 'import("' + avs_filter_path + 'ffms2.avsi")\r\n';

        avsStr += 'offset=' + offset + '\r\n';
        avsStr += 'score_length=' + score_length + '\r\n';
        avsStr += 'model_length=' + model_length + '\r\n';
        avsStr += 'logo_length=' + logo_length + '\r\n';
        avsStr += 'VideoPath="' + proPath + 'video/' + name + '.flv"\r\n';
        avsStr += 'model_PicPath="' + proPath + 'list/' + name + '.png"\r\n';
        avsStr += 'score_PicPath="' + proPath + 'list/' + name + '_score_.png"\r\n';
        avsStr += 'logo_picPath="' + proPath + 'public/logo.png"\r\n';
        avsStr += 'FFIndex(VideoPath)\r\n';
        avsStr += 'v=AudioDub(FFVideoSource(VideoPath), FFAudioSource(VideoPath)).convertfps(' + config.frameRate + ').ResampleAudio(44100).Normalize()\r\n';

        var border_LR = 0;
        var border_TB = 0;

        if ((width / height) == (config.width / config.height)) {
            border_LR = 0;
            border_TB = 0;
        } else if ((height / width) < (config.height / config.width)) {// 上下
            border_TB = Math.round((width / config.width * config.height - height) / 2);
        } else if ((height / width) > (config.height / config.width)) {
            border_LR = Math.round((height / config.height * config.width - width) / 2);
        }

        avsStr += 'border_LR=' + ((border_LR%2)==0?border_LR:(border_LR+1)) + '\r\n';
        avsStr += 'border_TB=' + ((border_TB%2)==0?border_TB:(border_TB+1)) + '\r\n';
        avsStr += 'Lanczos4Resize(AddBorders(v,border_LR,border_TB,border_LR,border_TB,color=$000000),' + config.width + "," + config.height + ')\r\n';

        avsStr += 'ConvertToRGB32()\r\n';
        avsStr += 'score_img=ImageSource(score_PicPath,pixel_type="rgb32").LanczosResize(' + config.width + "," + config.height + ')\r\n';
        avsStr += 'model_img=ImageSource(model_PicPath,pixel_type="rgb32").LanczosResize(' + config.width + "," + config.height + ').FadeIn(10)\r\n';
        avsStr += 'logo_img=ImageSource(logo_PicPath,pixel_type="rgb32").LanczosResize(' + config.width + "," + config.height + ').FadeIn(10)\r\n';

        avsStr += 'offset1 = (offset + score_length) * 30\r\n';
        avsStr += 'offset2 = (offset + score_length + model_length) *30\r\n';
        avsStr += 'offset3 = (offset + score_length + model_length + logo_length) *30\r\n';
        avsStr += 'a=Trim(offset*30,offset1).Layer(score_img,x=0,y=0).FadeIn(10)\r\n';
        avsStr += 'b=Trim(offset1+1,offset2).Layer(model_img,x=0,y=0)\r\n';
        avsStr += 'c=Trim(offset2+1,offset3).FadeOut(100).Layer(logo_img,x=0,y=0)\r\n';
        avsStr += 'return a+b+c\r\n';

        return avsStr;
    };


    this.makeCombineAvs = function(configs) {
        // 制作合并的avs:av123_av144.avs
        var combineAvsStr = "";
        var combineAvsNames = [];
        var combineFlag = false;
        var name_avs = [];
        for (var i = 0; i < configs.length; i++) {
            if (configs[i].no_pause == true) {
                // 本次是无缝

                if (combineFlag == true) {
                    // 上一个无缝(追加)
                    combineAvsStr += configs[i].name + '=directshowSource("' + configs[i].name + '.avs")\r\n';
                    combineAvsNames.push(configs[i].name);
                } else {
                    // 上一个不是无缝(初始化)
                    combineAvsStr = configs[i].name + '=directshowSource("' + configs[i].name + '.avs")\r\n';
                    combineAvsNames = [];
                    combineAvsNames.push(configs[i].name);

                }
                combineFlag = true;

            } else {
                // 本次不是无缝
                if (combineFlag == true) {
                    // 上次是无缝(结束输出)
                    combineAvsStr += configs[i].name + '=directshowSource("' + configs[i].name + '.avs")\r\n';
                    combineAvsNames.push(configs[i].name);

                    combineAvsStr += "return Dissolve(" + combineAvsNames.join(",") + ",10)";

                    name_avs.push({
                        name: combineAvsNames.join("_"),
                        avs: combineAvsStr
                    });
                }

                combineFlag = false;
            }

        }

        return name_avs;

    };


    this.makePressBatStr = function(videoMsg) {

        var videoPath = videoMsg.path;
        var videoRate = videoMsg.video_code_rate;
        var audioRate = videoMsg.audio_code_rate;
        var name = videoMsg.name;
        var width = videoMsg.video_width;
        var height = videoMsg.video_height;
        var frameRate = videoMsg.video_frame_rate;
        
        var proPath = window['_proPath'].replace(/\//g,'\\');
        
        var pressStr = "@echo off\n";
        // atools
        // pressStr += '"' + proPath + 'assets\\script\\x264" "' + videoPath + '" --fps ' + frameRate + ' --crf 18 --aq-mode 1 --deblock 0.8:0.6 --weightp 2 --aq-strength 1 ' + '--pass 1 --threads auto --merange 16 --8x8dct --bframes 0 --ref 6 --me hex ' + '--subme 6 --partitions none --direct auto --trellis 1 --b-pyramid normal ' + '--psy-rd 0.5:0.3 --analyse all --b-adapt 2 --chroma-qp-offset -1 -o NUL  ' + '--qcomp 0.6 --rc-lookahead 60 --video-filter resize:' + width + ',' + height + '\n';
        // pressStr += '"' + proPath + 'assets\\script\\x264" "' + videoPath + '" --fps ' + frameRate + ' ' + '--bitrate ' + videoRate + ' --aq-mode 1 --weightp 2 --deblock 0.8:0.6 --aq-strength 1 ' + '--pass 2 --threads auto --merange 16 --8x8dct --bframes 0 --ref 6 --me umh ' + '--subme 9 --partitions all --direct auto --trellis 1 --b-pyramid normal ' + '--psy-rd 0.5:0.3 --analyse all --b-adapt 0 --chroma-qp-offset -1  -o "' + proPath + 'assets\\script\\test_v.mp4"  --qcomp 0.6 --rc-lookahead 60 --video-filter resize:' + width + ',' + height + '\n';
        // biliran
        // pressStr += '"' + proPath + 'assets\\script\\x264" "' + videoPath + '" --keyint 300 --min-keyint 30 --fps 30 --level 51 --me umh --merange 32 --non-deterministic --subme 8 --psy-rd 1:0 --trellis 1 --ref 3 --bframes 6 --b-pyramid 1 --weightb --partitions all --8x8dct --direct auto --bitrate '+videoRate+ ' --qpstep 25 --cplxblur 50 --ratetol 10 --threads 3 --deldup 5:0.2:160:8:-1 --pass 1 -o NUL \n';
        pressStr += '"' + proPath + 'assets\\script\\x264" "' + videoPath + '" --keyint 300 --min-keyint 30 --fps 30 --level 51 --me umh --merange 32 --non-deterministic --subme 8 --psy-rd 1:0 --trellis 1 --ref 3 --bframes 6 --b-pyramid 1 --weightb --partitions all --8x8dct --direct auto --bitrate '+videoRate+ ' --qpstep 25 --cplxblur 50 --ratetol 10 --threads 3  --pass 1 -o NUL \n';
        // pressStr += '"' + proPath + 'assets\\script\\x264" "' + videoPath + '" --keyint 300 --min-keyint 30 --fps 30 --level 51 --me umh --merange 32 --non-deterministic --subme 8 --psy-rd 1:0 --trellis 1 --ref 3 --bframes 6 --b-pyramid 1 --weightb --partitions all --8x8dct --direct auto --bitrate '+videoRate+ ' --qpstep 25 --cplxblur 50 --ratetol 10 --threads 3  --pass 3 -o NUL \n';
        pressStr += '"' + proPath + 'assets\\script\\x264" "' + videoPath + '" --keyint 300 --min-keyint 30 --fps 30 --level 51 --me umh --merange 32 --non-deterministic --subme 8 --psy-rd 1:0 --trellis 1 --ref 3 --bframes 6 --b-pyramid 1 --weightb --partitions all --8x8dct --direct auto --bitrate '+videoRate+ ' --qpstep 25 --cplxblur 50 --ratetol 10 --threads 3  --pass 2 --qcomp 0.5 -o ' + proPath + 'assets\\script\\test_v.mp4 \n';

        pressStr += '"' + proPath + 'assets\\script\\ffmpeg2" -i "' + videoPath + '" -r ' + videoRate + ' -ar 44100 -f wav - | "' + proPath + 'assets\\script\\neroaacenc" -lc -br ' + audioRate + '000 -if - -ignorelength -of "' + proPath + 'assets\\script\\test_a.m4a"\n';

        if (videoPath.indexOf(".avs") != -1) {
            pressStr += '"' + proPath + 'assets\\script\\mp4box" -add "' + proPath + 'assets\\script\\test_v.mp4" -add "' + proPath + 'assets\\script\\test_a.m4a" -new "' + proPath + "video_avs\\" + name + '.mp4"\n';
        } else {
            pressStr += '"' + proPath + 'assets\\script\\mp4box" -add "' + proPath + 'assets\\script\\test_v.mp4" -add "' + proPath + 'assets\\script\\test_a.m4a" -new "' + proPath + "output\\" + name + '.mp4"\n';
        }

        pressStr += 'if exist .stats del .stats\n';
        pressStr += 'if exist .stats.mbtree del .stats.mbtree\n';
        pressStr += 'if exist x264_2pass.log del x264_2pass.log\n';
        pressStr += 'if exist x264_2pass.log.mbtree del x264_2pass.log.mbtree\n';
        pressStr += 'if exist "' + proPath + 'assets\\script\\test_a.m4a" del "' + proPath + 'assets\\script\\test_a.m4a"\n';
        pressStr += 'if exist "' + proPath + 'assets\\script\\test_v.mp4" del "' + proPath + 'assets\\script\\test_v.mp4"\n';

        pressStr += 'exit\n';

        return pressStr;
    };

    /**
     * 4.0.0
     * 制作合并脚本
     * @param listFilePath
     * @param name
     * @returns {string}
     */
     this.makeMergeBatStr = function(listFilePath, name) {
        return '@echo off\n\r' + ffmpeg_exePath + "ffmpeg.exe -y -f concat -i " + listFilePath + " -c copy " + name + ".mp4";
    };

    this.makeMergeListFileStr = function(configs, hasNext) {

        var combineFlag = false;
        var combineFileNames = [];
        var combineTempNames = [];
        for (var i = 0; i < configs.length; i++) {
            if (configs[i].no_pause == true) {
                // 本次是无缝
                if (combineFlag == true) {
                    // 上一个无缝(追加)
                    combineTempNames.push(configs[i].name);
                } else {
                    // 上一个不是无缝(初始化)
                    combineTempNames = [];
                    combineTempNames.push(configs[i].name);
                }
                combineFlag = true;

            } else {
                // 本次不是无缝
                if (combineFlag == true) {
                    // 上次是无缝(结束输出)
                    combineTempNames.push(configs[i].name);
                    combineFileNames.push(combineTempNames.join("_"));

                } else {

                    // 上次不是无缝
                    combineFileNames.push(configs[i].name);
                }

                combineFlag = false;
            }

        }

        var listDataStr = "";
        for (var i = 0; i < combineFileNames.length; i++) {

            listDataStr += "file '.\\..\\..\\video_avs\\" + combineFileNames[i] + ".mp4'\r\n";

            if (hasNext && i < (combineFileNames.length - 1)) {
                listDataStr += "file '.\\..\\..\\public\\next.mp4'\r\n";
            }

        }
        return listDataStr;

    };

    /**
    * 4.0.0
    * 制作bug，list文件
    * @param path
    * @returns {string}
    */
    this.makeAddBugFileStr = function(path) {
        var content = "file '" + path + "'\n";
        content += "file '.\\..\\..\\public\\debug.mp4'\n";
        return content;
    };


    this.getCombineFileNames = function(configs) {

        var combineFlag = false;
        var combineFileNames = [];
        var combineTempNames = [];
        for (var i = 0; i < configs.length; i++) {
            if (configs[i][':no_pause'] == true) {
                // 本次是无缝
                if (combineFlag == true) {
                    // 上一个无缝(追加)
                    combineTempNames.push(configs[i][':name']);
                } else {
                    // 上一个不是无缝(初始化)
                    combineTempNames = [];
                    combineTempNames.push(configs[i][':name']);
                }
                combineFlag = true;

            } else {
                // 本次不是无缝
                if (combineFlag == true) {
                    // 上次是无缝(结束输出)
                    combineTempNames.push(configs[i][':name']);
                    combineFileNames.push(combineTempNames.join("_"));

                } else {
                    // 上次不是无缝
                    combineFileNames.push(configs[i][':name']);
                }

                combineFlag = false;
            }

        }

        return combineFileNames;
    };


    this.getBiliVideoUrl =function* (aid){

        var baseUrl = 'http://www.flvcd.com/';
        var html = yield jQueryUtil.ajaxCo(baseUrl+'parse.php?kw=http://www.bilibili.com/video/av'+aid+'/', {}, 'GET');

        var type = 'base';
        // 判断是否有supper
        var toUrl = null;
        if(/<a href="([^"]+)"><font color="red"><B>超清版解析<\/B>/.test(html)){
            // super
            // console.log("super");
            var reg_super= new RegExp('<a href="([^"]+)"><font color="red"><B>超清版解析</B>');
            toUrl= reg_super.exec(html)[1];
            type = 'super';
        }else if(/<a href="([^"]+)"><font color="red"><B>高清版解析<\/B>/.test(html)){
            // high 
            // console.log("high");
            var reg_high = new RegExp('<a href="([^"]+)"><font color="red"><B>高清版解析</B>');
            toUrl = reg_high.exec(html)[1];
            type = 'high';
        }


        if(toUrl!=null){
            html = yield jQueryUtil.ajaxCo(baseUrl + toUrl, {}, 'GET');
            // console.log(html)
            // console.log(baseUrl + toUrl)
        }



        // base
        var reg_url = new RegExp('下载地址：<a href="([^"]+)+"'); 
        var url = reg_url.exec(html)[1];

        return {url:url,type:type};

    }



}