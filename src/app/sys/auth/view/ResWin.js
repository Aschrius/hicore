Ext.define('Tool.sys.auth.view.ResWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.sys-auth_res-win',
    id: 'system-auth_res-win',
    dto: {
        actionType: 0,// 查:0增1,改2,删-1
    },
    initComponent: function () {

        let me = this;

        let iconCls = 'Vcard';
        if (me.dto.showType == 1) {
            iconCls = 'Vcardadd';
        } else if (me.dto.showType == 2) {
            iconCls = 'Vcardedit';
        } else if (me.dto.showType == -1) {
            iconCls = 'Vcarddelete';
        } else {
            iconCls = 'Vcard';
        }


        me.title = '<span style="font-weight: bold;">资源信息</span>';
        me.resizable = false;
        me.modal = true;
        me.iconCls = iconCls;
        me.items = {
            xtype: 'form',
            layout: 'hbox',
            defaults: {
                xtype: 'container',
                layot: 'vbox',
                aligen: 'stretch',
                defaultType: 'textfield',
                defaults: {
                    labelAlign: 'top'
                }
            },
            items: [{
                padding: '0 5 0 10',
                items: [{
                    fieldLabel: 'pid',
                    name: 'pid',
                    allowBlank: false,
                    hidden: false,
                    readOnly: true
                }, {
                    fieldLabel: 'id',
                    name: 'id',
                    hidden: false,
                    readOnly: true
                }, {
                    xtype: 'combo',
                    fieldLabel: '资源类别',
                    name: 'resTypeId',
                    allowBlank: false,
                    store: 'Tool.sys.auth.store.ResTypeStore',

                    displayField: 'display',
                    valueField: 'value',

                    editable: false,
                    readOnly: me.dto.actionType != 1,

                    emptyText: '请选择...',
                }, {
                    fieldLabel: '资源名称',
                    name: 'name',
                    allowBlank: false,
                    readOnly: me.dto.actionType == 0
                }, {
                    fieldLabel: 'xtype',
                    name: 'xtype',
                    allowBlank: true,
                    readOnly: me.dto.actionType == 0
                }, {
                    fieldLabel: '排序号',
                    name: 'orderNum',
                    value: 100,
                    allowBlank: false,
                    readOnly: me.dto.actionType == 0
                }]

            }, {
                padding: '0 10 0 5',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'urlRegExp',
                    name: 'urlRegExp',
                    readOnly: me.dto.actionType == 0,
                    width: 270
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'urlMethod',
                    name: 'urlMethod',
                    readOnly: me.dto.actionType == 0,
                    width: 270
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'interfaceIds',
                    name: 'interfaceIds',
                    readOnly: me.dto.actionType == 0,
                    width: 270
                }, {
                    xtype: 'textarea',
                    fieldLabel: 'extraPermissionJson',
                    name: 'extraPermissionJson',
                    readOnly: me.dto.actionType == 0,
                    height: 270,
                    width: 270
                }]
            }],
            buttons: [{
                text: '改',
                doAction: 'doModify',
                hidden: me.dto.actionType != 2
            }, {
                text: '增',
                doAction: 'doAdd',
                hidden: me.dto.actionType != 1
            }]
        };

        me.callParent(arguments);
    }
});