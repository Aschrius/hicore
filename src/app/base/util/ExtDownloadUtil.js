function ExtDownloadUtil() {
  // 默认约定xtype==id
  var me = this;
  this.doUpdateDownloadProgress = function(downloadUtil,cursor,total){
    var total = downloadUtil.formConfig.total;
    var cursor = downloadUtil.formConfig.total - downloadUtil.formConfig.wait - downloadUtil.formConfig.progress;
    var text = '下载进度('+cursor+'/'+total+')';
    var downloadPan = downloadUtil.view.down('basedownloadpan');
    var progress_ = downloadPan.down('progressbar[action=progress]');
    progress_.updateProgress(cursor/total,text,true);
  };
 
  this.addDownloadTask = function(downloadUtil,data){
    var me = this;
    var store = downloadUtil.store;
    store.add(data);
    ++downloadUtil.formConfig.total;
    ++downloadUtil.formConfig.wait;
    downloadUtil.form.setValues(downloadUtil.formConfig);
    me.doUpdateDownloadProgress(downloadUtil);
    return store.getAt(store.getCount()-1);
  };
  this.getNextDownloadRecord = function(downloadUtil){
    if(typeof(downloadUtil)=='undefined'||downloadUtil==null){
      extUtil.showTip('未初始化');
      return;
    }
    var store = downloadUtil.store;

    for(var i = 0;i<store.getCount();i++){
      var record = store.getAt(i);
      var status = record.get('status') ;
      if(status!=1&&status!=2&& status!=-1 && !downloadUtil.isDelayTask(record.get('id'))){
        return record;
      }
    }
    return null;
  };
  this.startDownloadNextTask = function(downloadUtil,success,fail){
    var me = this;
    var nextRecord = me.getNextDownloadRecord(downloadUtil);
    if(nextRecord!=null){
      // console.log('start next task : '+nextRecord.get('name'));
      downloadUtil.delayNextTask(nextRecord.get('id'));
      me.startDownloadTask(downloadUtil,nextRecord,success,fail);
    }
  };
  this.startDownloadTask = function(downloadUtil,record,success,fail){
    var me = this;
    if(typeof(downloadUtil)=='undefined'||downloadUtil==null){
      this.showTip('downloadUtil not found');
      return;
    }


    --downloadUtil.formConfig.wait;
    ++downloadUtil.formConfig.progress;
    downloadUtil.form.setValues(downloadUtil.formConfig);

    var id = record.get('id');
    var name = record.get('name');
    var filePath = record.get('filePath');
    var tmpPath = record.get('tmpPath');
    var url = record.get('url');
    var headers = record.get('headers');

    var urlTemp = new RegExp('http://([^:/]+)([^$]+)', 'g').exec(url);


    downloadUtil.addTask({
      id: id,
      host: urlTemp[1],
      path: urlTemp[2],
      // port: 80,
      method: 'GET',
      filePath: filePath,
      tmpPath:tmpPath,
      headers: headers,
    }, function (length, total) {
      // data
      record.set('progress', Math.floor(length / total * 100 * 100) / 100);
      record.set('size', length + '/' + total);
      record.set('status', 2);
      record.commit();
      

    }, function () {
      // err
      --downloadUtil.formConfig.progress;
      downloadUtil.form.setValues(downloadUtil.formConfig);
      record.set('status', -1);
      record.commit();
      if(typeof(fail)=='function'){
        fail(record);
      }

      // me.startDownloadNextTask(downloadUtil);


    }, function () {
      // success

      --downloadUtil.formConfig.progress;
      downloadUtil.form.setValues(downloadUtil.formConfig);
      record.set('status', 1);
      record.commit();
      if(typeof(success)=='function'){
        success(record);
      }
      me.startDownloadNextTask(downloadUtil,success,fail);
      me.doUpdateDownloadProgress(downloadUtil);

    });


  };
  this.reDownload= function(downloadUtil,id,success,fail){
    downloadUtil.abortTask(id);
    var record = downloadUtil.store.getById(id);

    if(record==null)return;
    me.startDownloadTask(downloadUtil,record,success,fail);
    
  }


};
