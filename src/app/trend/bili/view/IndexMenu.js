Ext.define('Tool.trend.bili.view.IndexMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.trend-bili_index-menu',
    id: 'trend-bili_index-menu',
    initComponent: function () {

        let me = this;

        let status = me.dto.record.get('status');

        me.style = {
            overflow: 'visible'
        };
        let statusText = null;

        if (status == 6) {
            statusText = '统计排名';
        } else if (status == 3) {
            statusText = '重新统计';
        } else {
        }

        let store = Ext.StoreMgr.get('trend-bili_bili_part-store');
        let datMenus = [];
        for (let i = 0; i < store.count(); i++) {
            let record = store.getAt(i);
            datMenus.push({
                text: 'part' + record.get('part') + ' - ' + record.get('name'),
                doAction: 'showDocPartWin',
                dto: {
                    record:record,
                    parent: me.dto
                },
            });
        }

        me.items = [
            {
                text: '<span style="color:green;">' + statusText + '</span>',
                iconCls: 'Vcardadd',
                hidden: status != 6 && status != 3,
                doAction: 'doRank',
                dto: {
                    type: 1004
                }
            },
            {
                text: '<span style="color:green;">发布稿件</span>',
                iconCls: 'Vcardadd',
                hidden: status != 2,
                doAction: 'doRank',
                dto: {
                    type: 1005
                }
            },
            {
                text: '<span style="color:green;">查看结果</span>',
                iconCls: 'Vcardadd',
                hidden: status != 3 && status != 2 && status != 1,
                doAction: 'show',
                dto: {
                    actionType: 1,
                    winXtype: 'trend-bili_doc_filter-win',
                    // winXtype: 'trend-bili_doc-win',
                    beforeShowFn: function (win, dto, data) {
                        let store = Ext.StoreMgr.get('trend-bili_filter-store');
                        Ext.apply(store.getProxy().extraParams, {
                            rankId: data.rankId,
                            indexId: data.id
                        });

                        // 只是加载store
                        store.load({
                            scope: this,
                            callback: function (records, operation, success) {
                                if (success) {
                                    if (typeof ( records) == 'undefined' || records == null || records.length == 0) {
                                        win.close();
                                        Ext.MessageBox.show({
                                            title: 'Error',
                                            msg: '<span style="color:red;font-weight: bold;">暂无数据</span>',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.ERROR
                                        });
                                    } else {
                                        let radiogroup = win.down('radiogroup[action=filterId]');
                                        for (let i = 0; i < store.count(); i++) {
                                            let r = store.getAt(i);
                                            radiogroup.add({
                                                boxLabel: r.get('name'),
                                                inputValue: r.get('id')
                                            });
                                        }


                                    }
                                } else {
                                    win.close();
                                    Ext.MessageBox.show({
                                        title: 'Error',
                                        msg: '<span style="color:red;font-weight: bold;">暂无数据</span>',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.ERROR
                                    });
                                }
                            }
                        });

                    }
                }
            },
            {
                text: '<span style="color:green;">导出数据</span>',
                iconCls: 'Vcardadd',
                hidden: status != 3 && status != 2 && status != 1,
                menu: [].concat(datMenus)
            },
            {
                text: '<span style="color:gray;">统计中</span>',
                hidden: status != 4 && status != 5,
            }
        ];

        me.callParent(arguments);
    }
});

