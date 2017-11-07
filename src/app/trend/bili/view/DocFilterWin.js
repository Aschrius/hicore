Ext.define('Tool.trend.bili.view.DocFilterWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_doc_filter-win',
    id: 'trend-bili_doc_filter-win',
    title: '模块',
    initComponent: function () {
        let me = this;

        let indexRecord = me.dto.parent.record;
        let indexStatus = indexRecord.get('status');
        let hidePickup = false;
        if (indexStatus != null)
            if (indexStatus == 2 || indexStatus == 1 || indexStatus == -1) {
                hidePickup = true;
            }


        let id = Ext.ComponentQuery.query('trend-index-pan combobox[name=rank]')[0].getValue();
        me.layout = 'fit';
        me.border = false;
        me.bodyBorder = false;
        me.modal = true;
        me.width = document.body.clientWidth * 0.8;
        me.height = document.body.clientHeight * 0.8;
        me.maximized = true;
        me.items = [{
            xtype: 'grid',
            border: false,
            store: 'Tool.trend.bili.store.DocFilterStore',
            plugins: [
                {
                    ptype: 'rowexpander',
                    rowBodyTpl: new Ext.XTemplate(
                        '<tpl><p style="color: darkslategrey;">{description}</p></tpl>'
                    )
                }
            ],
            columns: [
                {
                    xtype: 'rownumberer', width: 50
                }, {
                    text: '总排名',
                    dataIndex: 'rank',
                    flex: 1
                }, {
                    text: '得分',
                    dataIndex: 'score',
                    width: 65,
                }, {

                    text: '编号',
                    dataIndex: 'aid',
                    flex: 1,
                    listeners: {
                        click: function (column, htmlElement, index, k, e, record) {
                            let aid = record.get('aid');

                            try {
                                let exec = require('child_process').exec;
                                let cmdStr = 'start www.bilibili.com/video/av' + aid + '/';
                                exec(cmdStr, function (err, stdout, stderr) {
                                });
                            } catch (e) {
                                window.open('htt://www.bilibili.com/video/av' + aid + '/');
                            }
                        }
                    },
                    renderer: function (value) {
                        return '<a href="#">av' + value + '</a>';
                    }
                }, {
                    text: '标题',
                    dataIndex: 'title',
                    flex: 3
                }, {
                    text: '投稿',
                    dataIndex: 'createdDateStr',
                    width: 120,
                }, {
                    text: 'up',
                    dataIndex: 'up',
                    flex: 1
                }, {
                    text: '播放',
                    dataIndex: 'play',
                    width: 60
                }, {
                    text: '收藏',
                    dataIndex: 'favorites',
                    width: 60
                }, {
                    text: '评论',
                    dataIndex: 'review',
                    width: 60
                }, {
                    text: '弹幕',
                    dataIndex: 'video_review',
                    width: 60
                }, {
                    text: '硬币',
                    dataIndex: 'coins',
                    width: 60
                }, {
                    text: '稿件',
                    dataIndex: 'status',
                    width: 50,
                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                        if (value == 0) {
                            value = `<span style="color: dodgerblue;">新</span>`;
                        } else if (value == 1) {
                            value = `<span style="color: darkslategray;">旧</span>`;
                        } else if (value == -1) {
                            value = `<span style="color: red;">丢</span>`;
                        } else if (value == -2) {
                            value = `<span style="color: red;">回</span>`;
                        } else {
                            value = `<span style="color: lightgray;">？</span>`;
                        }
                        return value;
                    }
                }, {
                    text: '收录',
                    dataIndex: 'mark_status',
                    width: 50,
                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                        if (value == 1) {
                            value = `<span style="color: green;font-weight: bold">√</span>`;
                        } else {
                            value = `<span style="color: lightgrey;">×</span>`;
                        }
                        return value;
                    }
                }, {
                    xtype: 'actioncolumn',
                    action: 'addOrDeleteAction',
                    header: '本期推荐',
                    flex: 1,
                    align: 'center',
                    hidden: hidePickup,
                    items: [
                        {
                            getClass: function (v, meta, record) {
                                let indexRecord = me.dto.parent.record;
                                let pickupBatchNo = record.get('pickupBatchNo');

                                if (pickupBatchNo == null) {
                                    return 'AtAdd'
                                } else if (pickupBatchNo == indexRecord.get('batchNo')) {
                                    return 'AtDelete'
                                } else {
                                    return 'AtForbidden'
                                }
                            },
                            handler: function (grid, rowIndex, colIndex, item) {
                                let record = grid.getStore().getAt(rowIndex);
                                this.fireEvent('addOrDelclick', item, grid, record);
                            }
                        }
                    ]
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'radiogroup',
                            action: 'filterId',
                            defaults: {
                                width: 100,
                                name: 'filterId',
                            },
                            items: [
                                {
                                    boxLabel: '全部',
                                    inputValue: null,
                                    checked: true
                                }
                            ],
                            readOnly: me.dto.actionType == 0,
                            allowBlank: false
                        }
                    ]
                }, {
                    xtype: 'pagingtoolbar',
                    dock: 'bottom',
                    displayInfo: true,
                    store: 'Tool.trend.bili.store.DocFilterStore'
                }

            ]

        }];

        this.callParent();
    }
});