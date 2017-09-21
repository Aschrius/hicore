Ext.define('Tool.trend.bili.view.DocPartWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_doc_part-win',
    id: 'trend-bili_doc_part-win',
    title: '分p数据',
    initComponent: function () {
        let id = Ext.ComponentQuery.query('trend-index-pan combobox[name=rank]')[0].getValue();
        let me = this;
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
            store: 'Tool.trend.bili.store.DocPartStore',
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
                    width: 50
                }, {
                    text: '收录',
                    dataIndex: 'mark_status',
                    width: 50
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        '->',
                        {
                            doAction: 'doExpData',
                            text: '导出',
                        }
                    ]

                }

            ]

        }];

        this.callParent();
    }
}); 