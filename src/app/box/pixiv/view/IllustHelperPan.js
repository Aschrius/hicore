Ext.define('Tool.box.pixiv.view.IllustHelperPan', {
    extend: 'Ext.panel.Panel',
    id: 'box-pixiv_illust-helper-pan',
    alias: 'widget.box-pixiv_illust-helper-pan',

    title: '辅助',
    statics: {},
    initComponent: function () {

        let me = this;

        let store = Ext.StoreMgr.get('box-pixiv_illust-hepler-store');
        // me.closable = false;
        me.layout = 'border';
        me.border = false;
        me.bodyBorder = false;


        me.items = [{
            xtype: 'panel',
            region: 'north',
            layout: 'hbox',
            border: false,
            dockedItems: [
                {
                    xtype: 'toolbar',
                    items: ['->', {
                        xtype: 'textfield',
                        name: 'memberId',
                        fieldLabel: 'memberId',
                        regex: /^\d+$/g,
                        regexText: '输入有误'
                    }, {
                        xtype: 'button',
                        doAction: 'anaMemberId',
                        text: '获取'
                    }],
                    dock: 'top',
                }],
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
                                    text: 'name'
                                }, {
                                    xtype: 'label',
                                    action: 'member_id',
                                    text: 'member_id'
                                }, {
                                    xtype: 'label',
                                    action: 'total',
                                    text: 'total'
                                }
                            ]
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
                columns: [
                    {
                        xtype: 'rownumberer', width: 50
                    }, {
                        dataIndex: 'name',
                        flex: 1,
                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                            let ret = null;
                            try {
                                let type = record.get('type');
                                switch (type) {
                                    case 1:
                                        type = '单图';
                                        break;
                                    case 2:
                                        type = '多图';
                                        break;
                                    case 3:
                                        type = 'zip';
                                        break;
                                    default:
                                        type = '其他';
                                        break;
                                }

                                ret = '<div style="padding:5px;width:100%;height:70px;">' +
                                    '<div style="float:left">' +
                                    '<img style="border-radius:10px" width="60" height="60" src="' +
                                    record.get('cover')
                                    + '">' +
                                    '</div>' +
                                    '<div style="float:left;margin-left:50px;width:10%;">' +
                                    '<div style="padding:4px;font-weight:bold;font-size:18px;">' + record.get('title') + '</div>' +
                                    '<div style="padding:4px;color:#aaa;">' + record.get('illust_id') + '</div>' +
                                    // '<div style="padding:4px;">' + '<span style="color:#aaa">' + type + '</span></div>' +
                                    '</div>' +
                                    '</div>';
                            } catch (e) {
                                console.error(e);
                            }
                            return ret;
                        }
                    }
                ]
            }
        ];

        me.callParent(arguments);
    }
});

