Ext.define('Tool.trend.bili.view.MarkSearchWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_mark_search-win',
    id: 'trend-bili_mark_search-win',
    dto: {
        actionType: 0,// 查:0增1,改2,删-1
    },
    initComponent: function () {

        let me = this;

        let iconCls = 'Vcard';
        if (me.showType == 1) {
            iconCls = 'Vcardadd';
        } else if (me.showType == 2) {
            iconCls = 'Vcardedit';
        } else if (me.showType == -1) {
            iconCls = 'Vcarddelete';
        } else {
            iconCls = 'Vcard';
        }

        let markStatusStore = Ext.StoreMgr.get('trend-bili_mark_status-store');
        let pickupStatusStore = Ext.StoreMgr.get('trend-bili_pickup_status-store');
        let searchStore = Ext.StoreMgr.get('trend-bili_mark_search-store');


        me.title = '<span style="font-weight: bold;">搜索辅助</span>';

        me.maximized = true;
        me.modal = true;
        me.iconCls = iconCls;
        me.layout = 'fit';
        me.items = {
            xtype: 'grid',
            action: 'markHelper',
            layout: 'fit',
            border: false,
            bodyBoder: false,
            hideHeaders: false,
            store: searchStore,
            sortableColumns: false,
            plugins: [
                {
                    ptype: 'rowexpander',
                    selectRowOnExpand: true,
                    rowBodyTpl: new Ext.XTemplate(
                        '<tpl><p style="color: darkslategrey;">{desc}</p></tpl>'
                    ),
                    listeners: {
                        expandbody: function () {//无法触发这个是事件
                            console.log('Ext.grid.plugin.RowExpander');
                        }
                    }

                },
                Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1 //设置单击单元格编辑
                    }
                )
            ],

            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    dock: 'bottom',

                    displayInfo: false,
                    store: searchStore,
                },
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    boder: false,
                    bodyBoder: false,
                    items: [
                        {
                            xtype: 'textfield',
                            label: '',
                            action: 'keyword',
                            labelWidth: 0,
                            readOnly: true,
                            labelSeparator: ''
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    action: 'hot_toolbar',
                    boder: false,
                    bodyBoder: false,
                    items: [
                        {
                            xtype: 'radiogroup',
                            action: 'action2',
                            boder: false,
                            bodyBoder: false,
                            defaults: {
                                width: 78,
                                name: 'order',
                            },
                            items: [
                                {
                                    boxLabel: '综合排序',
                                    checked: true,
                                    inputValue: 'totalrank',
                                }, {
                                    boxLabel: '最新发布',
                                    inputValue: 'pubdate',
                                }, {
                                    boxLabel: '播放',
                                    inputValue: 'click',
                                }, {
                                    boxLabel: '收藏',
                                    inputValue: 'stow',
                                }, {
                                    boxLabel: '评论',
                                    inputValue: 'scores',
                                }, {
                                    boxLabel: '硬币',
                                    inputValue: 'promote',
                                }, {
                                    boxLabel: '弹幕',
                                    inputValue: 'dm',
                                }
                            ],
                            allowBlank: false
                        },
                    ]
                }
            ],


            columns: [
                {
                    xtype: 'rownumberer', width: 50

                }, {
                    dataIndex: 'aid',
                    header: '作品编号',
                    width: 85,
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
                        return '<a href="#">' + value + '</a>';
                    }
                }, {
                    dataIndex: 'title',
                    header: '标题',
                    flex: 3,
                }, {
                    dataIndex: 'create',
                    header: '投稿',
                    width: 130,
                }, {
                    dataIndex: 'author',
                    header: 'UP',
                    maxWidth: 130,
                    renderer: function (value, m, record) {
                        let blackStatus = record.get('blackStatus');
                        if (parseInt(blackStatus) == 1) {
                            return '<span style="color: green;"><strong>' + value + '</strong></span>'
                        } else {
                            return value;
                        }
                    }
                }, {
                    dataIndex: 'play',
                    header: '播放',
                    flex: 1,
                }, {
                    dataIndex: 'videoReview',
                    header: '弹幕',
                    flex: 1,
                }, {
                    dataIndex: 'thisRank',
                    header: '本期排名',
                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {

                        if (value <= 0) {
                            value = `<span style="color: #f1f1f1">-</span>`;
                        }
                        return value;
                    }

                }, {
                    dataIndex: 'thisMarkStatus',
                    header: '本期收录',
                    flex: 1,
                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                        if (value == 1) {
                            value = `<span style="color: green;font-weight: bold">√</span>`;
                        } else {
                            value = `<span style="color: lightgrey;">×</span>`;
                        }
                        return value;
                    }

                }, {
                    dataIndex: 'thisStatus',
                    header: '本期稿件',
                    flex: 1,
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
                    dataIndex: 'description',
                    header: '备注',
                    editor: {
                        xtype: 'textfield'
                    },

                    flex: 1,
                }, {
                    dataIndex: 'status',
                    header: '收录',
                    width: 60,
                    editor: {
                        xtype: 'combo',
                        store: markStatusStore,
                        allowBlank: false,
                        displayField: 'display',
                        valueField: 'value',
                        emptyText: '状态',
                        editable: false
                    },
                    renderer: function (value, meta, record) {
                        let rowIndex = markStatusStore.find('value', value);
                        if (rowIndex < 0) {
                            return '';
                        }

                        let record_ = markStatusStore.getAt(rowIndex);
                        return record_.get('display');

                    }
                }, {
                    dataIndex: 'pickupStatus',
                    header: '推荐',
                    width: 60,
                    editor: {
                        xtype: 'combo',
                        store: pickupStatusStore,
                        allowBlank: false,
                        displayField: 'display',
                        valueField: 'value',
                        emptyText: '状态',
                        editable: false
                    },
                    renderer: function (value, meta, record) {
                        let rowIndex = pickupStatusStore.find('value', value);
                        if (rowIndex < 0) {
                            return '';
                        }

                        let record_ = pickupStatusStore.getAt(rowIndex);
                        return record_.get('display');

                    }

                }, {
                    xtype: 'actioncolumn',
                    action: 'addOrDeleteAction',
                    header: '本期推荐',
                    hidden: true,
                    flex: 1,
                    align: 'center',
                    items: [{
                        getClass: function (v, meta, record) {
                            try {
                                let index = me.dto.index;
                                let pickupBatchNo = record.get('pickupBatchNo');
                                if (pickupBatchNo == null) {
                                    return 'AtAdd'
                                } else if (pickupBatchNo == index.batchNo) {
                                    return 'AtDelete'
                                } else {
                                    return 'AtForbidden'
                                }

                            } catch (e) {
                                console.log(e)
                            }
                        },
                        handler: function (grid, rowIndex, colIndex, item) {
                            let record = grid.getStore().getAt(rowIndex);
                            this.fireEvent('addOrDelclick', item, grid, record);
                        }
                    }]
                }
            ]


        };


        me.callParent(arguments);
    }
});