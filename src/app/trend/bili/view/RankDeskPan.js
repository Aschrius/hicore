Ext.define('Tool.trend.bili.view.RankDeskPan', {
    extend: 'Ext.panel.Panel',
    status: {
        id: 'trend-bili_rank_desk-pan'
    },
    alias: 'widget.trend-bili_rank_desk-pan',
    id: 'trend-bili_rank_desk-pan',
    title: '工作台',
    initComponent: function () {
        let me = this;

        me.xtype = 'panel';
        me.layout = 'fit';
        me.border = false;
        me.bodyBorder = false;
        me.items = {
            tabPosition: 'right',
            xtype: 'tabpanel',
            layout: 'fit',
            border: false,
            bodyBorder: false,
            style: {
                background: "#fff"
            },
            items: {
                title: '榜单',
                xtype: 'panel',
                //TODO 居中
                layout: {
                    type: 'vbox',
                    align: 'middle',
                    pack: 'center'
                },
                border: false,
                bodyBorder: false,
                items: [
                    {
                        xtype: 'container',
                        height: 210,
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'box',
                                name: 'face',
                                width: 190,
                                height: 190,
                                autoEl: {
                                    tag: 'img',
                                    src: null
                                }
                            },
                            {
                                xtype: 'container',
                                height: 200,
                                layout: 'vbox',
                                padding: 10,
                                items: [
                                    {
                                        xtype: 'label',
                                        style: 'color:#555;font-weight:bold;font-size:25px;line-height:25px;',
                                        height: 30,
                                        width: 200,
                                        name: 'name',
                                        text: 'XXXXXXXXXX排行榜'
                                    }, {
                                        xtype: 'label',
                                        name: 'id',
                                        text: '编号'
                                    }, {
                                        xtype: 'label',
                                        name: 'batchNo',
                                        text: '第 x 期'
                                    }

                                ]

                            }

                        ]

                    }, {
                        xtype: 'label',
                        padding: 10,
                        name: 'progress',
                        html: '收录进行中&nbsp;&nbsp;》&nbsp;&nbsp;数据获取&nbsp;&nbsp;》&nbsp;&nbsp;计算收录&nbsp;&nbsp;》&nbsp;&nbsp;计算总分&nbsp;&nbsp;》&nbsp;&nbsp;数据归档&nbsp;&nbsp;》&nbsp;&nbsp;发布'
                    }, {
                        xtype: 'container',
                        name: 'module',
                        layout: 'hbox',
                        width: 400,
                        defaults: {
                            xtype: 'container',
                            // toRoute: true,
                            listeners: {
                                mouseleave: {
                                    element: 'el',
                                    fn: function (e, t, eOpts) {
                                        t.style.color = "#222";
                                    }
                                },
                                mouseenter: {
                                    element: 'el',
                                    fn: function (e, t, eOpts) {
                                        t.style.color = "#ff8f42";
                                    }
                                },
                                click: {
                                    element: 'el',
                                    fn: function (e, t, eOpts) {
                                        let component_ = this.component;
                                        component_.fireEvent('click', component_, e, eOpts);
                                    }
                                },
                            },
                            // width: '10%',
                            layout: {type: 'hbox', align: 'stretch'},
                            padding: '0 10 10 10',
                            style: 'border-radius:0px;margin-right:5px;cursor:pointer;hover:{color:#E98200}',
                            defaults: {
                                style: 'line-height:30px;margin-left:10px;font-size:14px;font-weight:bold;cursor:pointer;',// 字体部分的
                            },

                        },
                        items: []// module
                    },
                    {
                        xtype: 'container',
                        name: 'module_2',
                        layout: 'hbox',
                        width: 400,
                        defaults: {
                            xtype: 'container',
                            listeners: {
                                mouseleave: {
                                    element: 'el',
                                    fn: function (e, t, eOpts) {
                                        t.style.color = "#222";
                                    }
                                },
                                mouseenter: {
                                    element: 'el',
                                    fn: function (e, t, eOpts) {
                                        t.style.color = "#ff8f42";
                                    }
                                },
                                click: {
                                    element: 'el',
                                    fn: function (e, t, eOpts) {
                                        let component_ = this.component;
                                        component_.fireEvent('click', component_, e, eOpts);
                                    }
                                },
                            },
                            // width: '10%',
                            layout: {type: 'hbox', align: 'stretch'},
                            padding: '0 10 10 10',
                            style: 'border-radius:0px;margin-right:5px;cursor:pointer;hover:{color:#E98200}',
                            defaults: {
                                style: 'line-height:30px;margin-left:10px;font-size:14px;font-weight:bold;cursor:pointer;',// 字体部分的
                            },

                        },
                        items: []// module
                    }
                ]

            }
        };

        me.callParent(arguments);
    }
});
