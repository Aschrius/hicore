Ext.define('Tool.trend.bili.view.MarkPan', {
    extend: 'Ext.panel.Panel',
    id: 'trend-bili_mark-pan',
    alias: 'widget.trend-bili_mark-pan',
    status: {
        id: 'trend-bili_mark-pan'
    },
    dto: {
        record: null
    },
    title: '收录',
    initComponent: function () {

        Ext.apply(Ext.form.VTypes, {
            daterange: function (val, field) {
                let date = field.parseDate(val);
                if (!date) {
                    return;
                }
                if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                    let start = Ext.getCmp(field.startDateField);
                    start.setMaxValue(date);
                    start.validate();
                    this.dateRangeMax = date;
                } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                    let end = Ext.getCmp(field.endDateField);
                    end.setMinValue(date);
                    end.validate();
                    this.dateRangeMin = date;
                }
                /*
                 * Always return true since we're only using this vtype to set
                 * the min/max allowed values (these are tested for after the
                 * vtype test)
                 */
                return true;
            }
        });

        let me = this;


        let pickupStatusStore = Ext.StoreMgr.get('trend-bili_pickup_status-store');
        let statusStore = Ext.StoreMgr.get('trend-bili_mark_status-store');
        let markStore = Ext.StoreMgr.get('trend-bili_mark-store');
        let markHelperStore = Ext.StoreMgr.get('trend-bili_mark_helper-store');


        me.closable = false;
        me.layout = 'border';
        me.border = false;
        me.bodyBorder = false;


        me.defaults = {
            xtype: 'panel',
            border: false,
            bodyBorder: false
        };

        me.items = [
            {
                region: 'north',
                hidden: true,
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        border: false,
                        dock: 'top',
                        items: [
                            '->',
                            {
                                xtype: 'label',
                                style: 'font-weight:bold;color:#4B9CD7;',
                                name: 'name',
                                text: 'loading'
                            },
                            {
                                xtype: 'label',
                                style: 'font-weight:bold;',
                                text: '#'
                            }, {
                                xtype: 'label',
                                style: 'font-weight:bold;',
                                name: 'batchNo',
                                text: 'loading'
                            },
                            {
                                xtype: 'label',
                                style: 'font-weight:bold;',
                                text: '@'
                            },
                            {
                                xtype: 'label',
                                style: 'font-weight:bold;color:#4B9CD7;',
                                name: 'tname',
                                text: 'loading'
                            },
                            {
                                xtype: 'label',
                                style: 'font-weight:bold;',
                                text: '-'
                            },
                            {
                                xtype: 'label',
                                name: 'status',
                                text: 'loading'
                            },
                        ]
                    }
                ]

            },
            {
                region: 'center',
                defaults: {
                    xtype: 'form',
                    layout: 'fit'
                },

                layout: {
                    type: 'accordion',
                    titleCollapse: false,
                    animate: true,
                    activeOnTop: true
                },
                items: [
                    {
                        title: '收录',
                        action: 'mark',
                        items: {
                            xtype: 'grid',
                            action: 'mark',
                            layout: 'fit',
                            border: false,
                            store: markStore,
                            bodyBorder: false,
                            plugins: [
                                Ext.create('Ext.grid.plugin.CellEditing', {
                                        clicksToEdit: 1 //设置单击单元格编辑
                                    }
                                )
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
                                    dataIndex: 'createdDate',
                                    header: '投稿',
                                    width: 130
                                }, {
                                    dataIndex: 'uname',
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
                                        store: statusStore,
                                        allowBlank: false,
                                        displayField: 'display',
                                        valueField: 'value',
                                        emptyText: '状态',
                                        editable: false
                                    },
                                    renderer: function (value, meta, record) {
                                        let rowIndex = statusStore.find('value', value);
                                        if (rowIndex < 0) {
                                            return '';
                                        }

                                        let record_ = statusStore.getAt(rowIndex);
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
                                    flex: 1,
                                    align: 'center',
                                    hidden: true,
                                    items: [
                                        {
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
                                            action: 'status',
                                            defaults: {
                                                width: 78,
                                            },
                                            items: [
                                                {
                                                    boxLabel: '全部',
                                                    checked: true,
                                                    name: 'status',
                                                    inputValue: null,
                                                }, {
                                                    boxLabel: '收录',
                                                    name: 'status',
                                                    inputValue: 1,
                                                }, {
                                                    boxLabel: '存疑',
                                                    name: 'status',
                                                    inputValue: 2,
                                                }, {
                                                    boxLabel: '排外',
                                                    name: 'status',
                                                    inputValue: -1,
                                                },

                                                {
                                                    boxLabel: '预推',
                                                    name: 'status',
                                                    inputValue: 'isPickup:2',
                                                }, {
                                                    boxLabel: '推荐',
                                                    pickupStatus: 2,
                                                    name: 'status',
                                                    inputValue: 'isPickup:1',
                                                }, {
                                                    boxLabel: '不推',
                                                    name: 'status',
                                                    inputValue: 'isPickup:-1',
                                                },
                                                {
                                                    boxLabel: '拉黑',
                                                    isPickup: true,
                                                    name: 'status',
                                                    inputValue: 'isPickup:-2',
                                                },


                                            ],
                                            allowBlank: false
                                        },
                                        '->',
                                        {
                                            group: 'markorder',
                                            xtype: 'datefield',
                                            vtype: 'daterange',//daterange类型为上代码定义的类型

                                            fieldLabel: 'from',
                                            id: 'markfrom', name: 'markfrom',


                                            endDateField: 'markto',
                                            width: 200,
                                            labelWidth: 30,
                                            labelSeparator: '',
                                            msgTarget: 'side',

                                            autoFitErrors: false,
                                            // value: Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY, -7), "Y-m-d"),
                                            allowBlank: true,
                                            format: 'Y-m-d',

                                            maxValue: new Date(),

                                        },
                                        {
                                            group: 'markorder',
                                            xtype: 'datefield',
                                            vtype: 'daterange',//daterange类型为上代码定义的类型

                                            fieldLabel: 'to',
                                            id: 'markto', name: 'markto',

                                            width: 200,
                                            labelWidth: 20,
                                            labelSeparator: '',
                                            msgTarget: 'side',

                                            autoFitErrors: false,
                                            // value: Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH, 0), "Y-m-d"),
                                            allowBlank: true,
                                            format: 'Y-m-d',

                                            maxValue: new Date(),


                                        }
                                    ]
                                },
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    items: [
                                        '->', {
                                            xtype: 'label',
                                            html: 'AV',
                                            style: 'background:#66ccff;height:24px;line-height:24px;width:24px;text-align:center;color:#fff;border-radius: 10px 0px 0px 0px;margin:0px'
                                        }, {
                                            xtype: 'textfield',
                                            regex: /^\d+$/g,
                                            allowBlank: false,
                                            regexText: '参数错误',
                                            width: 100,
                                            name: 'aid',
                                            style: 'margin:0px;'
                                        }, {
                                            xtype: 'button',
                                            doAction: 'doShow',
                                            text: '收录',
                                            style: 'margin-left:5px;'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'pagingtoolbar',
                                    store: markStore,
                                    dock: 'bottom',
                                    displayInfo: false,
                                }
                            ]

                        }


                    },
                    {
                        title: '辅助',
                        action: 'markHelper',
                        items: {
                            xtype: 'grid',
                            action: 'markHelper',
                            layout: 'fit',
                            border: false,
                            bodyBoder: false,
                            hideHeaders: false,
                            store: markHelperStore,
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
                                    store: markHelperStore,
                                },
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    boder: false,
                                    bodyBoder: false,
                                    items: [
                                        {
                                            xtype: 'radiogroup',
                                            action: 'action1',
                                            defaults: {
                                                width: 49,
                                            },
                                            items: [
                                                {
                                                    boxLabel: '全部',
                                                    checked: true,
                                                    name: 'original',
                                                    inputValue: false,
                                                }, {
                                                    boxLabel: '原创',
                                                    name: 'original',
                                                    inputValue: true,
                                                }, {
                                                    xtype: 'container',
                                                    width: 30,
                                                },
                                                {
                                                    boxLabel: '投稿时间',
                                                    name: 'order',
                                                    width: 80,
                                                    checked: true,
                                                    inputValue: 'default',
                                                }, {
                                                    boxLabel: '视频热度',
                                                    width: 80,
                                                    name: 'order',
                                                    inputValue: 'hot',
                                                }
                                            ],
                                            allowBlank: false
                                        },
                                        '->', {
                                            xtype: 'textfield',
                                            label: '',
                                            action:'keyword',
                                            labelWidth: 0,
                                            labelSeparator: ''
                                        }, {
                                            xtype: 'button',
                                            doAction: 'showMarkSearch',
                                            text: '检索'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    action: 'hot_toolbar',
                                    boder: false,
                                    bodyBoder: false,
                                    hidden: true,
                                    items: [
                                        {
                                            xtype: 'radiogroup',
                                            action: 'action2',
                                            boder: false,
                                            bodyBoder: false,
                                            defaults: {
                                                width: 78,
                                                name: 'order_type',
                                            },
                                            items: [
                                                {
                                                    boxLabel: '播放',
                                                    checked: true,
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
                                        '->',
                                        {
                                            xtype: 'datefield',
                                            group: 'order',
                                            name: 'from', id: 'from',
                                            vtype: 'daterange',//daterange类型为上代码定义的类型
                                            endDateField: 'to',//必须跟endDate的id名相同
                                            maxValue: new Date(),
                                            value: Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY, -7), "Y-m-d"),
                                            allowBlank: false, format: 'Y-m-d', fieldLabel: 'from', labelWidth: 30

                                        },
                                        {
                                            xtype: 'datefield',
                                            group: 'order',
                                            name: 'to', id: 'to',
                                            vtype: 'daterange',
                                            // startDateField:'from',
                                            maxValue: new Date(),
                                            value: Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH, 0), "Y-m-d")
                                            // value: Ext.util.Format.date(Ext.Date.now(), "Y-m-d"),
                                            , allowBlank: false, format: 'Y-m-d', fieldLabel: 'to', labelWidth: 20
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
                                    dataIndex: 'favorites',
                                    header: '收藏',
                                    flex: 1,
                                }, {
                                    dataIndex: 'video_review',
                                    header: '弹幕',
                                    flex: 1,
                                }, {
                                    dataIndex: 'stat',
                                    header: '评论',
                                    flex: 1,
                                    renderer: function (value) {
                                        if (typeof (value) == 'undefined') {
                                            return ''
                                        }

                                        return value.reply
                                    }
                                }, {
                                    dataIndex: 'stat',
                                    header: '硬币',
                                    flex: 1,
                                    renderer: function (value) {
                                        if (typeof (value) == 'undefined') {
                                            return ''
                                        }
                                        return value.coin
                                    }
                                    // }, {
                                    //     dataIndex: 'expression',
                                    //     header: '表达式',
                                    //     flex: 1,
                                    //     renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    //
                                    //         try {
                                    //             let id = Ext.ComponentQuery.query('trend-index-pan combobox[name=rank]')[0].getValue();
                                    //             let localRankStore = Ext.StoreMgr.get('trend-bili_local-rank-store');
                                    //             let idx = localRankStore.find('id', id);
                                    //             let rankRecord = localRankStore.getAt(idx);
                                    //
                                    //             let expressions = rankRecord.get('expressions');
                                    //             let play = record.get('play');
                                    //             let favorites = record.get('favorites');
                                    //             let videoReview = record.get('video_review');
                                    //             let coin = 0, reivew = 0;
                                    //             try {
                                    //                 coin = record.get('stat').coin;
                                    //                 review = record.get('stat').reply;
                                    //             } catch (e) {
                                    //             }
                                    //
                                    //             expressions = Ext.String.trim(expressions);
                                    //             expressions = expressions.replace(/play/g, play);
                                    //             expressions = expressions.replace(/favorites/g, favorites);
                                    //             expressions = expressions.replace(/videoReview/g, videoReview);
                                    //             expressions = expressions.replace(/coin/g, coin);
                                    //             expressions = expressions.replace(/review/g, review);
                                    //             expressions = expressions.replace(/\s/g, '');
                                    //             expressions = expressions.replace(/\n/g, '');
                                    //             expressions = expressions.replace(/\r/g, '');
                                    //             if (
                                    //                 /^[(\d+]/.test(expressions) &&
                                    //                 /[\d+)]$/.test(expressions) &&
                                    //                 /^[\d\+-\\*/\(\)]+$/.test(expressions)
                                    //             )
                                    //                 value = eval(expressions);
                                    //             else if (expressions == '')
                                    //                 value = '';
                                    //             else
                                    //                 value = '表达式有误1';
                                    //
                                    //         } catch (e) {
                                    //             value = '表达式有误2';
                                    //             console.log(e.stack);
                                    //         }
                                    //
                                    //         return value;
                                    //     }
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
                                        store: statusStore,
                                        allowBlank: false,
                                        displayField: 'display',
                                        valueField: 'value',
                                        emptyText: '状态',
                                        editable: false
                                    },
                                    renderer: function (value, meta, record) {
                                        let rowIndex = statusStore.find('value', value);
                                        if (rowIndex < 0) {
                                            return '';
                                        }

                                        let record_ = statusStore.getAt(rowIndex);
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
                        }
                    }
                ]
            }

        ];

        me.callParent(arguments);
    }
});

