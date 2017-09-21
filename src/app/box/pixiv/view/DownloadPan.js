Ext.define('Tool.box.pixiv.view.DownloadPan', {
    extend: 'Ext.panel.Panel',
    id: 'box-pixiv_download-pan',
    alias: 'widget.box-pixiv_download-pan',
    title: 'Pixiv下载',
    initComponent: function () {

        let store = Ext.StoreMgr.get('box-pixiv_download-store');
        let me = this;
        me.closable = false;
        me.layout = 'border';
        me.border = false;
        me.bodyBorder = false;
        me.items = [
            {
                xtype: 'grid',
                region: 'center',
                layout: 'fit',
                border: false,
                hideHeaders: false,
                store: store,
                tbar: [
                    '->',
                    {
                        text: '发起下载',
                        doAction: 'doDownloadNext'
                    }
                ],
                dockedItems: [
                    {
                        xtype: 'pagingtoolbar',
                        hidden: true,
                        store: store,
                        dock: 'bottom',
                        displayInfo: false
                    }
                ],
                columns: [
                    {
                        xtype: 'rownumberer', width: 50
                    }, {
                        header: '文件',
                        dataIndex: 'path',
                        flex: 1,
                        renderer: function (value) {
                            return value.match(/([^\/]+$)/)[0];
                        }
                    }, {
                        header: '进度',
                        minWidth: 60,
                        dataIndex: 'cursor',
                        xtype: 'gridcolumn',
                        flex: 6,
                        renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                            let result = '';
                            try {

                                let status = record.get('status');
                                let tag = '', percent = 0;
                                if (status == 1) {
                                    percent = 100;
                                    tag = '100%';
                                } else if (status == 2) {
                                    let total = record.get('total');
                                    let val = parseInt(value / total * 100, 10);
                                    percent = val;
                                    if (total < value) {
                                        percent = 0;
                                    }
                                    let speed = record.get('speed');
                                    tag = `${percent}% (${value}/${total} ${speed} M/s)`;


                                } else if (status == 3) {
                                    percent = 0;
                                    tag = '等待';

                                } else {
                                    percent = 0;
                                    tag = '等待';
                                }

                                result = ` 
                                      <div style='color:#8DB2E3; background-color:#ffffff;border: 1px #8DB2E3 solid;padding: 2px;'>
                                          <div style='height:12px;width:${percent}%;background-color:#8DB2E3;border: 0px;color:black;'>
                                          ${tag}
                                          </div>
                                      </div>
                                      `;
                            } catch (e) {
                                console.error(e);
                            }

                            return result;
                        }

                    }, {
                        header: '状态',
                        dataIndex: 'status',
                        renderer: function (value) {
                            if (value == 4) {
                                value = '<span style="color: darkgray;">新建</span>';
                            } else if (value == 3) {
                                value = '等待';
                            } else if (value == 2) {
                                value = '<span style="color: deepskyblue;">执行</span>';
                            } else if (value == 1) {
                                value = '<span style="color: green;">完成</span>';
                            } else if (value == -1) {
                                value = '<span style="color: red;">错误</span>';
                            } else {
                                value = '<span>未知</span>';
                            }
                            return value;
                        }
                    }

                ]
            }
        ];

        me.callParent(arguments);
    }
});

