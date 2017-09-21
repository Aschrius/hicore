Ext.define('Tool.trend.IndexPan', {
    extend: 'Ext.panel.Panel',
    id: 'trend-index-pan',
    title: '趋势',
    alias: 'widget.trend-index-pan',
    layout: 'vbox',
    border: false,
    bodyBorder: false,
    defaults: {
        padding: '0 50 0 50'
    },
    initComponent: function () {

        let userRankStore = Ext.StoreMgr.get('trend-bili_user_rank-store');
        Ext.apply(userRankStore.getProxy().extraParams, {
            userId: AT.app.id
        });

        let data = AT.auth.uiData;
        ExtUtil.initIndexView(this, data, 3);

        this.items.items.unshift({
            xtype: 'form',
            border: false,
            bodyBorder: false,
            layout: {type: 'vbox', align: 'center'},
            items: [
                {
                    xtype: 'container',
                    layout: 'vbox',
                    defaults: {
                        margin: '10 0 0 0'
                    },
                    items: [
                        {
                            xtype: 'box',
                            action: 'faceBili',
                            width: 100,
                            height: 100,
                            margin: '50 0 0 0',
                            autoEl: {
                                tag: 'img',
                                src: __dirname + '/trend/bili/res/bilibili.png'
                            }
                        }
                    ]

                },
                {
                    xtype: 'container',
                    layout: {type: 'hbox', align: 'middle', pack: 'center'},
                    width: '100%',
                    defaults: {
                        margin: '10 0 0 5'
                    },

                    items: [
                        {
                            xtype: 'label',
                            style: 'font-weight:bold;color:#666;padding-top:40;cursor:pointer',
                            doAction: 'showLoginBilibili',
                            action: 'infoBili',
                            text: '(未登入)',
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
                        }
                    ]

                },
                {
                    xtype: 'container',
                    margin: '30 0 10 0',
                    width: '100%',
                    height: 1,
                    style: 'background:#eee'
                },
                {
                    xtype: 'container',
                    width: '100%',
                    layout: {type: 'hbox', align: 'center'},
                    items: [{
                        xtype: 'button',
                        doAction: 'initRank',
                        text: '〇',
                        margin: '0 10px 0 0'
                    }, {
                        xtype: 'combobox',
                        name: 'rank',
                        fieldLabel: "<strong>榜单</strong>",
                        labelWidth: 45,
                        width: 300,
                        store: userRankStore,
                        editable: false,
                        displayField: 'name',
                        valueField: 'id',
                        emptyText: '-暂无数据-'
                    }, {
                        xtype: 'combobox',
                        style: 'margin-left:1rem;',
                        name: 'index',
                        fieldLabel: "<strong>期刊</strong>",
                        labelWidth: 45,
                        width: 200,
                        store: Ext.StoreMgr.get('trend-bili_rank_index-store'),
                        editable: false,
                        displayField: 'info',
                        valueField: 'id',
                        emptyText: '-暂无数据-',
                    }]

                },

            ]
        });

        this.callParent(arguments);
    }
});
