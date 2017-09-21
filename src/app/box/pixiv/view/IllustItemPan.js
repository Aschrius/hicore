Ext.define('Tool.box.pixiv.view.IllustItemPan', {
    extend: 'Ext.panel.Panel',
    id: 'box-pixiv_illust-item-pan',
    alias: 'widget.box-pixiv_illust-item-pan',
    title: '作品详情',
    initComponent: function () {

        let store = Ext.StoreMgr.get('box-pixiv_illust-item-store');
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
                xtype: 'grid',
                region: 'center',
                layout: 'fit',
                border: false,
                hideHeaders: true,
                store: store,
                dockedItems: {
                    xtype: 'pagingtoolbar',
                    store: store,
                    dock: 'bottom',
                    displayInfo: false,
                },
                columns: [
                    {
                        xtype: 'rownumberer', width: 50
                    }, {
                        dataIndex: 'name',
                        flex: 1,
                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {

                            let member_id = record.get('member_id');
                            let type = record.get('type');

                            let path = AT.app.path + '/../_pixiv/' + member_id + '/illust/' + value;
                            let ret =
                                `
                                <div style="padding:5px;width:100%;height:100%;">
                                    <div style="float:left">
                                        <img style="border-radius:10px" width="100%"  src="${path}">
                                    </div>
                                </div>
                                `;
                            return ret;
                        }
                    }
                ]
            }
        ];

        me.callParent(arguments);
    }
});

