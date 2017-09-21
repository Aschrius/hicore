Ext.define('Tool.sys.auth.view.UserPan', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sys-auth_user-pan',
    id: 'sys-auth_user-pan',
    title: '用户',
    initComponent: function () {
        let me = this;
        me.layout = 'fit';
        me.border = false;
        me.bodyBorder = false;
        me.items = [{
            xtype: 'grid',
            border: false,
            store: 'Tool.sys.auth.store.UserStore',
            tbar: [
                "->", {
                    xtype: 'button',
                    text: '增',
                    iconCls: 'Vcardadd',
                    doAction: 'show',
                    dto: {
                        actionType: 1,
                        winXtype: 'sys-auth_user-win',
                    }
                }
            ],
            columns: [{
                xtype: 'rownumberer',
                flex: 1
            }, {
                text: '名称',
                dataIndex: 'username',
                flex: 3
            }, {
                text: 'email',
                dataIndex: 'email',
                flex: 6
            }, {
                text: 'status',
                dataIndex: 'status',
                flex: 3,
                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                    var ret = null;
                    switch (value) {
                        case -1:
                            ret = '<span style="color: red">禁用</span>';
                            break;
                        case 1:
                            ret = '<span style="color: green">激活</span>';
                            break;
                        default :
                            ret = '<span style="color: gray">初始</span>';
                    }
                    return ret;
                }

            }],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                dock: 'bottom',
                displayInfo: true,
                store: 'Tool.sys.auth.store.UserStore',
            }]

        }];

        this.callParent();
    }
}); 