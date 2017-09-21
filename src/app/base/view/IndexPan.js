Ext.define('Tool.base.view.IndexPan', {
    extend: 'Ext.panel.Panel',
    id: 'base-index-pan',
    alias: 'widget.base-index-pan',
    title: '@',
    layout: 'vbox',
    border: false,
    bodyBorder: false,
    defaults: {
        padding: '0 50 0 50'
    },
    initComponent: function () {
        ExtUtil.initIndexView(this, {}, 3);
        this.items.items.unshift({
            xtype: 'form',
            border: false,
            bodyBorder: false,
            layout: {type: 'vbox', align: 'center'},
            items: [
                {
                    xtype: 'container',
                    layout: 'fit',
                    height: 185,
                    html: '<iframe scrolling="no" src="loading.html" frameborder="0" height="100%"></iframe>'
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
                            xtype: 'box',
                            action: 'face',
                            width: 25,
                            height: 25,
                            autoEl: {
                                tag: 'img',
                                src: __dirname + '/base/res/eylsun.png'
                            }
                        }, {
                            xtype: 'label',
                            style: 'font-weight:bold;color:#666;padding-top:40;;cursor:pointer;',
                            doAction: 'showLogin',
                            action: 'userInfo',
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

            ]
        });

        this.callParent(arguments);
    }
});
