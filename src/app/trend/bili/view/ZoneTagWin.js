Ext.define('Tool.trend.bili.view.ZoneTagWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_zonetag-win',
    id: 'trend-bili_zonetag-win',
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


        me.title = '<span style="font-weight: bold;">标签采集信息</span>';
        me.resizable = false;
        me.modal = true;
        // me.width = document.body.clientWidth * 0.9;
        // me.height = document.body.clientHeight * 0.9;

        me.maximized = true;
        me.layout = 'border';
        me.iconCls = iconCls;
        me.items = [{
            xtype: 'grid',
            region: 'center',
            layout: 'fit',
            border: false,
            store: 'Tool.trend.bili.store.ZoneTagStore',
            columns: [{
                xtype: 'rownumberer',
                flex: 1
            }, {
                text: 'id',
                dataIndex: 'id',
                flex: 3
            }, {
                text: '创建',
                dataIndex: 'createdDate',
                width: 130
            }, {
                text: '错误',
                dataIndex: 'errorDate',
                width: 130
            }, {
                text: '结束',
                dataIndex: 'finishDate',
                width: 130
            }, {
                text: '进度',
                dataIndex: 'cursorPage',
                flex: 3
            }, {
                text: '总量',
                dataIndex: 'totalPage',
                flex: 3
            }, {
                text: '备份',
                dataIndex: 'backup',
                renderer: function (value) {
                    return value == true ? '<span style="color: green">是</span>' : '<span style="color: red;">否</span>' ;
                },
                width: 50,
            }, {
                text: '清理',
                dataIndex: 'empty',
                renderer: function (value) {
                    return value == true ? '<span style="color: green">是</span>' : '<span style="color: red;">否</span>' ;
                },
                width: 50,
            }],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                dock: 'bottom',
                displayInfo: true,
                store: 'Tool.trend.bili.store.ZoneTagStore',
            }]
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