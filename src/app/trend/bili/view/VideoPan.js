Ext.define('Tool.trend.bili.view.VideoPan', {
    extend: 'Ext.panel.Panel',
    title: '视频',
    alias: 'widget.trend-bili_video-pan',
    statics: {
        ymlRecord: null
    },
    id: 'trend-bili_video-pan',
    initComponent: function () {
        // css 样式补充
        var css = document.createElement("style");
        css.setAttribute("type", "text/css");
        css.innerHTML = ".no_active_button .x-btn-inner { filter: alpha(opacity=30); -moz-opacity: 0.3; opacity: 0.3; } .switch_active_red { text-align: center; background: #FF8888; color: #fff; border-radius: 0; padding: 3px; cursor: pointer; border-bottom: solid 4px #eee; } .switch_active_green { text-align: center; background: #AAD145; color: #fff; border-radius: 0; padding: 3px; cursor: pointer; border-bottom: solid 4px #eee; } .switch_active_blue { text-align: center; background: #4B9CD7; padding: 3px; color: #fff; cursor: pointer; border-bottom: solid 4px #eee; } .switch_active_grey { text-align: center; background: #bbb; color: #fff; padding: 3px; cursor: pointer; border-bottom: solid 4px #eee; } .switch_disActive { text-align: center; background: #fafafa; color: #bbb; border-radius: 0; padding: 3px; cursor: pointer; border-bottom: solid 4px #fafafa; }";
        document.getElementsByTagName("head")[0].appendChild(css);

        var me = this;
        me.closable = false;
        me.layout = 'border';
        me.border = false;
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'bottom',
                items: [
                    {
                        doAction: 'reloadYml',
                        text: '重载目录',
                    },
                    '->',
                    {
                        doAction: 'doExpAvs',
                        text: '生成脚本',
                        disabled: true
                    },
                    {
                        doAction: 'doUpload',
                        hidden: true,
                        text: '共享数据',
                    }
                ]
            },
            {
                xtype: 'toolbar',
                dock: 'bottom',
                items: [
                    {
                        xtype: 'checkboxgroup',
                        id: 'checkboxgroup_videoOpt',
                        name: 'checkboxgroup_videoOpt',
                        fieldLabel: '<strong>视频选项</strong>',
                        width: 210,
                        labelWidth: 65,
                        defaults: {
                            labelWidth: 50, width: 50, name: 'cb'
                        },
                        items: [
                            {boxLabel: '过场', inputValue: '1', id: 'checkboxgroup_videoOpt_pause'},
                            {boxLabel: '前三', inputValue: '2', id: 'checkboxgroup_videoOpt_top'}
                        ]
                    }
                ]

            }

        ];
        me.items = [
            {
                xtype: 'dataview',
                region: 'west',
                layout: 'fit',
                autoScroll: true,
                action: 'yml',
                width: 100,
                style: 'background:#fafafa',
                multiSelect: true,
                tpl: new Ext.XTemplate(
                    '<tpl for=".">',
                    '<div style="cursor: pointer;margin-bottom: 5px;padding: 5px;" class="thumb-wrap">',
                    '<center><img height="80px" src="' + __dirname.replace(/\\/g, '/') + '/trend/bili/res/yml.png" /></center>',
                    '<center>{name}</center>',
                    '</div>',
                    '</tpl>'
                ),
                itemSelector: 'div.thumb-wrap',
                emptyText: '<span style="font-weight: bold;color: gray;">NO DATA</span>',
                store: 'Tool.trend.bili.store.YmlStore'


            }, {
                xtype: 'grid',
                region: 'center',
                layout: 'fit',

                action: 'data',
                border: false,
                hideHeaders: false,
                sortableColumns: false,
                store: 'Tool.trend.bili.store.VideoStore',
                columns: [
                    {header: 'rank', dataIndex: ':rank', flex: 1},
                    {header: 'name', dataIndex: ':name', width: 100},
                    {header: 'length', dataIndex: ':length', flex: 1},
                    {header: 'offset', dataIndex: ':offset', flex: 1},
                    {header: 'hit', dataIndex: ':hit', flex: 1},
                    {header: 'width', dataIndex: ':width', flex: 1},
                    {header: 'height', dataIndex: ':height', flex: 1},
                    {header: 'rate', dataIndex: ':rate', flex: 1},
                    {
                        header: 'statue', dataIndex: 'status', width: 75,
                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                            var ret = null;
                            switch (value) {
                                case -1:
                                    ret = '解析有误';
                                    break;
                                case 1:
                                    ret = '完毕';
                                    break;
                                case 2:
                                    ret = '正在解析';
                                    break;
                                case 404:
                                    ret = '不存在';
                                    break;
                                default :
                                    ret = '等待';
                            }
                            return ret;
                        }

                    },

                ]

            }
        ];

        me.callParent(arguments);

    }
});

