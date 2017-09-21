function DownloadUtil(view) {
  var fs = require('fs');
  var http = require('http');
  var me = this;
  this.view = view;
  this.store = view.down('basedownloadpan').down('grid').getStore();
  this.form = view.down('basedownloadpan').down('form').getForm();
  this.formConfig = {total:0,wait:0,progress:0};
  this.form.setValues(this.formConfig);

  this.dls = {};
  this.delayNextTaskMap = {};
  this.isDelayTask = function(id){
    return typeof(me.delayNextTaskMap[id])!='undefined';
  };
  this.delayNextTask = function(id){
    me.delayNextTaskMap[id] = true;
    setTimeout(function() {
      delete me.delayNextTaskMap[id];
    }, 1000*2);
  };


  this.addTask = function(config, dataFn, errFn, successFn) {

    var me = this;
    var total = 0;
    var length = 0;
    var writeStream = null;


    var res_end_event = function() {
      // 删除列表中taskId
      if (total === length) {
        // 正常结束
        // TODO更新UI
        // total, length
        // successFn();

        writeStream.end();

        // console.log("正常结束" + length + "/" + total);
        // 重命名为真正名
        fs.rename(config.tmpPath,config.filePath,function(){
          successFn();
        });

      } else {
        // 不正常
        errFn();
        // console.log("不正常结束" + length + "/" + total);
        if (writeStream != null)
          writeStream.end();
      }

    };
    var res_error_event = function(e) {
      // TODO更新UI,提示
      // total, length
      errFn();
      console.log(e);
      if (writeStream != null)
        writeStream.end();
    };

    var req_response_event = function(resp) {
      total = parseInt(resp.headers['content-length']);
      // console.log("resp:");
      // console.log(resp["headers"]["location"]);
      //console.log(resp);
      // console.log(resp["statusCode"]);
      if (resp["statusCode"] == 302) {
        config.url = resp["headers"]["location"];
        console.log("重定向:statusCode:302:" + config.url);
        me.addTask(config, dataFn, errFn, successFn);

      } else {
        // 检查完毕开始下载

        // 具体操作
        // TODO添加正在下载的队列id；
        // me.taskIdsObj[config.id] = { res: resp, req: req, config: config };


      }
    };
    var req_error_event = function(e) {
      errFn();
      console.log(e.stack)
      // me.uiUtils.appendCMD("error:" + config.fileName);
      // me.fs.appendFile(me.nwUtils.getProjectPath() + "err.log", e);
      if (writeStream != null)
        writeStream.end();

      // me.addTask(config);
    };

    var success = function(res) {
      // console.log(config.tmpPath)
      writeStream = fs.createWriteStream(config.tmpPath);
      res.on('data', function(chunk) {
        length += chunk.length;
        // TODO更新UI
        // total, length
        // console.log(length / total * 100 + '%')
        dataFn(length, total)
        if (writeStream.write(chunk) === false) {
          res.pause();
        }

      });
      writeStream.on('drain', function() { res.resume(); });
      res.on('end', res_end_event);
      res.on('error', res_error_event);
    };


    if (config.url != null) {
      var urlTemp = config.url.replace(/http:\/\//g, "");
      var splitIndex = urlTemp.indexOf("/");
      config.host = urlTemp.substring(0, splitIndex);
      config.path = urlTemp.substring(splitIndex, urlTemp.length);
      config.headers["Host"] = config.host;
    }
    // console.log(config);


    var req = http.request({
      host: config.host,
      path: config.path,
      //uri:config.uri,
      port: 80,
      method: config.method,
      headers: config.headers,
    }, success);




    req.on('response', req_response_event);
    req.on("error", req_error_event);
    // console.log('------------------' + config.filePath);
    req.end();
    me.dls[config.id + ''] = req;

  };

  this.abortTask = function(id) {
    var me = this;
    var req = me.dls[id + ''];
    if (req != null) {
      req.abort();
    }
  };


}
