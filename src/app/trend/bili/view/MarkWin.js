Ext.define('Tool.trend.bili.view.MarkWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_mark-win',
    id: 'trend-bili_mark-win',
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

        let markStatusStore = Ext.StoreMgr.get('trend-bili_mark_status-store');
        let pickupStore = Ext.StoreMgr.get('trend-bili_pickup_status-store');

        me.title = '<span style="font-weight: bold;">收录信息</span>';

        me.resizable = false;
        me.width = 450;
        me.modal = true;
        me.iconCls = iconCls;
        me.items = {
            xtype: 'form',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                labelAlign: 'right',
                labelWidth: 50,
                readOnly: true,
                xtype: 'textfield',
                margin: '5 5 5 5'
            },
            items: [
                {
                    name: 'aid',
                    fieldLabel: '编号'
                }, {
                    name: 'title',
                    fieldLabel: '标题'
                }, {
                    name: 'uname',
                    fieldLabel: 'up主:'
                }, {
                    name: 'createdDate',
                    fieldLabel: '投稿:'
                }, {
                    name: 'page',
                    fieldLabel: '分p:'
                },
                {
                    xtype: 'sparklineline'
                },
                {
                    xtype: 'combobox',
                    readOnly: false,
                    store: pickupStore,
                    allowBlank: false,
                    displayField: 'display_no_style',
                    valueField: 'value',
                    name: 'pickupStatus',
                    emptyText: '♂',
                    fieldLabel: '推♂荐',
                    editable: false,// 不可编辑，人工输入
                },
                {
                    xtype: 'combobox',
                    readOnly: false,
                    store: markStatusStore,
                    allowBlank: false,
                    displayField: 'display_no_style',
                    valueField: 'value',
                    name: 'status',
                    emptyText: '♂',
                    fieldLabel: '收♂录',
                    editable: false,// 不可编辑，人工输入
                }, {
                    xtype: 'textareafield',
                    readOnly: false,
                    fieldLabel: '备♂注',
                    emptyText: '♂',
                    labelWidth: 50,
                    grow: true,
                    name: 'description',
                    anchor: '100%',
                    maxLength: 400,
                    maxLengthText: '长度限制:400',
                    height: 60
                }
            ]
        };

        me.buttons = [
            {
                text: '确定',
                doAction: 'doModifyFromWin'
            }
        ];


        me.callParent(arguments);
    }
});