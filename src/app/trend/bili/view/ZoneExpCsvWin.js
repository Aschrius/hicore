Ext.define('Tool.trend.bili.view.ZoneExpCsvWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_zoneexpcsv-win',
    id: 'trend-bili_zoneexpcsv-win',
    dto: {
        actionType: 0,// 查:0增1,改2,删-1
    },
    initComponent: function () {

        let me = this;

        let iconCls = 'Vcard';
        if (me.showType == 1) {
            iconCls = 'Vcardadd';
        } else if (me.showType == 2) {
            iconCls = 'Vcardedit';
        } else if (me.showType == -1) {
            iconCls = 'Vcarddelete';
        } else {
            iconCls = 'Vcard';
        }


        me.title = '<span style="font-weight: bold;">数据源管理</span>';
        me.resizable = false;
        me.modal = true;
        // me.width = document.body.clientWidth * 0.9;
        // me.height = document.body.clientHeight * 0.9;

        me.maximized = true;
        me.layout = 'border';
        me.iconCls = iconCls;
        me.items = [{
            xtype: 'trend-bili_expcsv-grid',
            dto:{
                showType:0
            },
            region: 'center',
            layout: 'fit',
            border: false,
            store: 'Tool.trend.bili.store.ZoneExpCsvStore',
            viewConfig: {
                stripeRows: true,  // 奇偶行不同底色
                plugins: {
                    ptype: 'gridviewdragdrop',
                    ddGroup: 'expCsvMixGroup',
                    enableDrop: false
                },
                listeners: {
                    drop: function (node, data, dropRec, dropPosition) {
                        var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
                        Ext.example.msg("Drag from right to left", 'Dropped ' + data.records[0].get('name') + dropOn);
                    }
                }
            },
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    style: 'background:#fafafa',
                    padding: 10,
                    layout: {
                        type: 'hbox',
                        align: 'stretchmax',
                        pack: 'center'
                    },
                    defaults: {
                        xtype: 'container',
                        style: 'background:#fafafa',
                        defaults: {

                            xtype: 'container',
                            // style: 'background:#fafafa',
                        },
                        layout: {
                            type: 'vbox',
                            align: 'stretchmax',
                            pack: 'center'
                        },
                    },
                    items: [
                        {
                            width: 60,
                            // record 拖拽区
                            items: [
                                {
                                    action: 'old',
                                    style: 'cursor:pointer',
                                    items: [

                                        {
                                            xtype: 'box',
                                            width: 30,
                                            height: 30,
                                            autoEl: {
                                                tag: 'img',
                                                src: ''
                                            }
                                        },
                                        {
                                            xtype: 'label',
                                            width: 50,
                                            maxWidth: 50,
                                            minWidth: 50,
                                            style: 'cursor:pointer;margin-left:5px;',
                                            text: 'old'
                                        }
                                    ],
                                    listeners: {
                                        click: {
                                            element: 'el',
                                            fn: function (e, t, eOpts) {
                                                let component_ = this.component;
                                                component_.fireEvent('click', component_, e, eOpts);
                                            }
                                        },
                                        render: function (component) {
                                            component.dropZone = new Ext.dd.DropZone(component.getEl(), {
                                                // 此处的ddGroup需要与Grid中设置的一致
                                                ddGroup: 'expCsvMixGroup',
                                                // 这个函数没弄明白是啥意思,没有还不行
                                                getTargetFromEvent: function (e) {
                                                    return e.getTarget('');
                                                },
                                                // 用户拖动选中的记录经过了此按钮
                                                onNodeOver: function (target, dd, e, data) {
                                                    return Ext.dd.DropZone.prototype.dropAllowed;
                                                },
                                                // 用户放开了鼠标键，删除记录
                                                onNodeDrop: function (target, dd, e, data) {
                                                    component.fireEvent('addCsv', component, data); // 执行click事件
                                                }
                                            })
                                        }
                                    }
                                }, {
                                    action: 'new',
                                    style: 'cursor:pointer',
                                    items: [

                                        {
                                            xtype: 'box',
                                            width: 30,
                                            height: 30,
                                            autoEl: {
                                                tag: 'img',
                                                src: ''
                                            }
                                        }, {
                                            xtype: 'label',
                                            width: 50,
                                            maxWidth: 50,
                                            minWidth: 50,
                                            style: 'cursor:pointer;margin-left:5px;',
                                            text: 'new'
                                        }
                                    ],
                                    listeners: {
                                        click: {
                                            element: 'el',
                                            fn: function (e, t, eOpts) {
                                                let component_ = this.component;
                                                component_.fireEvent('click', component_, e, eOpts);
                                            }
                                        },
                                        render: function (component) {
                                            component.dropZone = new Ext.dd.DropZone(component.getEl(), {
                                                // 此处的ddGroup需要与Grid中设置的一致
                                                ddGroup: 'expCsvMixGroup',
                                                // 这个函数没弄明白是啥意思,没有还不行
                                                getTargetFromEvent: function (e) {
                                                    return e.getTarget('');
                                                },
                                                // 用户拖动选中的记录经过了此按钮
                                                onNodeOver: function (target, dd, e, data) {
                                                    return Ext.dd.DropZone.prototype.dropAllowed;
                                                },
                                                // 用户放开了鼠标键，删除记录
                                                onNodeDrop: function (target, dd, e, data) {
                                                    component.fireEvent('addCsv', component, data); // 执行click事件
                                                }
                                            })
                                        }
                                    }
                                }
                            ]
                        }, {
                            items: {
                                style: 'line-height:30px',
                                xtype: 'box',
                                width: 30,
                                height: 30,
                                autoEl: {
                                    tag: 'img',
                                    src: 'trend/bili/res/mix.png'
                                }
                            }
                        }, {
                            items: [
                                {
                                    xtype: 'datetimefield',
                                    action: 'old',
                                    name: 'date',
                                    fieldLabel: '旧',
                                    editable: true,
                                    emptyText: '--请选择--',
                                    format: 'Y-m-d H:i:s',
                                    altFormats: 'Y-m-d H:i:s',
                                    labelWidth: 30
                                },
                                {
                                    xtype: 'datetimefield',
                                    name: 'date',
                                    action: 'new',
                                    fieldLabel: '新',
                                    editable: true,
                                    emptyText: '--请选择--',
                                    format: 'Y-m-d H:i:s',
                                    altFormats: 'Y-m-d H:i:s',
                                    labelWidth: 30
                                }

                            ]
                        }, {
                            xtype: 'toolbar',
                            border: false,
                            bodyBorder: false,
                            items: [
                                {
                                    xtype: 'button',
                                    doAction: 'doMix',
                                    text: 'MIX!!'
                                }
                            ]
                        }

                    ]
                },
                {
                    xtype: 'pagingtoolbar',
                    dock: 'bottom',
                    displayInfo: true,
                    store: 'Tool.trend.bili.store.ZoneExpCsvStore',
                }
            ]
        }, {
            xtype: 'form',
            defaultType: 'textfield',
            defaults: {
                labelAlign: 'right',
                labelWidth: 50,
                margin: '5 5 5 5'
            },
            items: [{
                fieldLabel: 'id',
                xtype: 'numberfield',
                name: 'id',
                hidden: true
            }]
        }];

        me.buttons = [{
            text: '改',
            doAction: 'doModify',
            hidden: me.dto.actionType != 2
        }, {
            text: '增',
            doAction: 'doAdd',
            hidden: me.dto.actionType != 1
        }];


        me.callParent(arguments);
    }
});