Ext.define('Tool.box.pixiv.view.IllustItemAnimationPan', {
    extend: 'Ext.panel.Panel',
    id: 'box-pixiv_illust-item-animation-pan',
    alias: 'widget.box-pixiv_illust-item-animation-pan',
    title: '作品详情',
    initComponent: function () {

        let me = this;
        me.closable = false;
        me.layout = 'border';
        me.border = false;
        me.bodyBorder = false;
        me.items = [
            {
                xtype: 'panel',
                region: 'north',
                layout: 'hbox',
                border: false,
                items: [
                    {
                        xtype: 'box',
                        action: 'face',
                        style: 'margin-left:25px;margin-right:25px;',
                        width: 50,
                        height: 50,
                        autoEl: {
                            tag: 'img',
                            src: __dirname + '/box/pixiv/res/pixiv.ico'
                        }
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        defaults: {
                            margin: '0 25 0 25',
                            xtype: 'container',
                            border: false,
                            layout: 'hbox',
                        },
                        items: [
                            {
                                defaults: {
                                    margin: '25 0 0 25',
                                },
                                items: [
                                    {
                                        xtype: 'label',
                                        action: 'name',
                                        style: 'font-weight:bold',
                                        text: 'name'
                                    }, {
                                        xtype: 'label',
                                        action: 'member_id',
                                        style: 'color:grey;',
                                        text: 'member_id'
                                    }, {
                                        xtype: 'label',
                                        style: 'color:grey;',
                                        action: 'total',
                                        text: 'total'
                                    }, {
                                        xtype: 'label',
                                        style: 'font-weight:bold',
                                        action: 'title',
                                        text: 'title'
                                    }
                                ],
                            }
                        ]
                    }

                ]
            },
            {
                xtype: 'panel',
                region: 'center',
                layout: 'fit',
                border: false,
                width: '100%',
                height: '100%',
                html: ''
            }
        ];

        me.callParent(arguments);
    }
});

