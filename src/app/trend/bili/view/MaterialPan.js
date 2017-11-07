Ext.define('Tool.trend.bili.view.MaterialPan', {
    extend: 'Ext.panel.Panel',
    title: '素材',
    alias: 'widget.trend-bili_material-pan',
    id: 'trend-bili_material-pan',
    initComponent: function () {


        let me = this;

        me.closable = false;
        me.layout = 'border';
        me.border = false;
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'bottom',
                items: [
                    {
                        doAction: 'reloadCsv',
                        text: '重载目录',
                    },
                    '->',
                    {
                        doAction: 'doExpAll',
                        disabled: true,
                        text: '生成素材',
                    }
                ]
            },
            {
                xtype: 'toolbar',
                dock: 'bottom',
                items: [
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '<strong>类型</strong>',
                        labelWidth: 40,
                        action: 'type',
                        defaults: {
                            width: 75,
                            name: 'type',
                        },

                        items: [
                            {
                                boxLabel: '主榜',
                                checked: true,
                                inputValue: '1',
                            },
                            {
                                boxLabel: '副榜',
                                hidden: false,
                                inputValue: '2',
                            },
                            {
                                boxLabel: '特刊',
                                hidden: false,
                                inputValue: '3',
                            }
                        ],
                        allowBlank: false
                    },
                    {
                        xtype: 'checkboxgroup',
                        labelWidth: 0,
                        defaults: {
                            width: 74
                        },
                        items: [
                            {boxLabel: '前三', id: 'checkboxgroup_meterial_top'}
                        ]
                    },
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '<strong>排序</strong>',
                        action: 'sort',
                        labelWidth: 40,
                        defaults: {
                            width: 75,
                            name: 'sort',
                        },
                        items: [
                            {
                                boxLabel: '正序',
                                checked: true,
                                inputValue: 1,
                            },
                            {
                                boxLabel: '倒序',
                                inputValue: -1,
                            }
                        ],
                        allowBlank: false
                    },
                ]

            }

        ];
        me.items = [
            {
                xtype: 'dataview',
                region: 'west',
                layout: 'fit',
                autoScroll: true,
                action: 'csv',
                width: 100,
                style: 'background:#fafafa',
                multiSelect: false,
                tpl: new Ext.XTemplate(
                    '<tpl for=".">',
                    '<div style="cursor: pointer;margin-bottom: 5px;padding: 5px;" class="thumb-wrap">',
                    '<center><img height="80px" src="' + __dirname.replace(/\\/g, '/') + '/trend/bili/res/csv.png" /></center>',
                    '<center>{name}</center>',
                    '</div>',
                    '</tpl>'
                ),
                itemSelector: 'div.thumb-wrap',
                emptyText: '<span style="font-weight: bold;color: gray;">NO DATA</span>',
                store: 'Tool.trend.bili.store.CsvStore'


            },
            {
                xtype: 'grid',
                region: 'center',
                layout: 'fit',
                action: 'data',
                border: false,
                hideHeaders: false,
                sortableColumns: false,
                store: 'Tool.trend.bili.store.CsvDataStore',
                columns: [
                    {header: 'rank', dataIndex: 'rank', flex: 1},
                    {header: 'aid', dataIndex: 'aid', flex: 1},
                    {header: 'title', dataIndex: 'title', width: 100},
                    {header: 'score', dataIndex: 'score', flex: 1},
                    {header: 'up', dataIndex: 'up', flex: 1},
                    {header: 'date', dataIndex: 'date', width: 100},
                    {header: 'play', dataIndex: 'play', flex: 1},
                    {header: 'favorites', dataIndex: 'favorites', flex: 1},
                    {header: 'review', dataIndex: 'review', flex: 1},
                    {header: 'video_review', dataIndex: 'video_review', flex: 1},
                    {header: 'coins', dataIndex: 'coins', flex: 1},

                ]

            }
        ];

        me.callParent(arguments);

    }
});

