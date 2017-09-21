Ext.define('Tool.trend.bili.view.RankWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.trend-bili_rank-win',
    id: 'trend-bili_rank-win',
    dto: {
        actionType: 0,// 查:0增1,改2,删-1
    },
    initComponent: function () {

        let me = this;

        let iconCls = 'Vcard';
        if (me.dto.actionType == 1) {
            iconCls = 'Vcardadd';
        } else if (me.dto.actionType == 2) {
            iconCls = 'Vcardedit';
        } else if (me.dto.actionType == -1) {
            iconCls = 'Vcarddelete';
        } else {
            iconCls = 'Vcard';
        }

        let zoneStore = Ext.StoreMgr.get('trend-bili_rankzone-store');

        me.title = '<span style="font-weight: bold;">排行榜信息</span>';
        me.maximized = true;
        me.resizable = true;
        me.modal = true;
        me.layout = 'border';
        me.iconCls = iconCls;
        me.defaults = {
            split: false,                 //是否有分割线
            collapsible: true,           //是否可以折叠
            bodyStyle: 'padding:0px',
            border: false,
            bodyBorder: false,

        };
        me.items = [{
            xtype: 'container',
            region: 'center',
            layout: 'vbox',
            defaults: {
                border: false,
                bodyBorder: false,
            },
            items: [
                {
                    xtype: 'label',
                    text: '规则',
                    style: 'background:#f9f9f9;width:100%;'
                },
                {
                    xtype: 'grid',
                    action: 'rule',
                    store: 'Tool.trend.bili.store.RankRuleStore',
                    width: '100%',
                    flex: 1,
                    columns: [{
                        xtype: 'rownumberer',
                        flex: 1
                    }, {
                        text: '版本',
                        dataIndex: 'version',
                        flex: 3
                    }, {
                        text: '备注',
                        dataIndex: 'description',
                        flex: 6

                    }]
                },
                {
                    xtype: 'label',
                    text: '模块',
                    style: 'background:#f9f9f9;width:100%;'
                },
                {
                    xtype: 'grid',
                    action: 'filter',
                    store: 'Tool.trend.bili.store.RankRuleFilterStore',
                    width: '100%',
                    flex: 2,
                    columns: [{
                        xtype: 'rownumberer',
                        flex: 1
                    }, {
                        text: '标题',
                        dataIndex: 'name',
                        flex: 3
                    }, {
                        text: '备注',
                        dataIndex: 'description',
                        flex: 6
                    }]
                },
                {
                    xtype: 'label',
                    text: '制作分段',
                    style: 'background:#f9f9f9;width:100%;'
                },
                {
                    xtype: 'grid',
                    action: 'part',
                    store: 'Tool.trend.bili.store.RankRulePartStore',
                    width: '100%',
                    flex: 2,
                    columns: [{
                        xtype: 'rownumberer',
                        flex: 1
                    }, {
                        text: '标题',
                        dataIndex: 'name',
                        flex: 3
                    }, {
                        text: '备注',
                        dataIndex: 'description',
                        flex: 6
                    }]
                }
            ]
        }, {
            width: 250,
            xtype: 'form',
            title: '基础信息',
            region: 'west',
            defaults: {
                xtype: 'textfield',
                labelAlign: 'right',
                labelWidth: 60,
                margin: '5 5 5 5',
            },
            items: [
                {
                    fieldLabel: 'id',
                    name: 'id',
                    regex: /^\d+$/,
                    regexText: '数字',
                    readOnly: me.dto.actionType == 0,
                    allowBlank: false
                }, {
                    fieldLabel: '名称',
                    name: 'name',
                    readOnly: me.dto.actionType == 0,
                    allowBlank: false
                }, {
                    fieldLabel: '类型',
                    xtype: 'combo',
                    store: 'Tool.trend.bili.store.RankTypeStore',
                    editable: false,
                    displayField: 'name',
                    valueField: 'type',

                    name: 'type',
                    readOnly: me.dto.actionType == 0,
                    emptyText: '请选择...',

                    allowBlank: false
                }, {
                    fieldLabel: '数据类型',
                    xtype: 'combo',
                    store: 'Tool.trend.bili.store.RankDataTypeStore',
                    editable: false,
                    displayField: 'name',
                    valueField: 'type',

                    name: 'dataType',
                    readOnly: me.dto.actionType == 0,
                    emptyText: '请选择...',
                    allowBlank: false
                }, {
                    fieldLabel: '区',
                    name: 'zoneId',
                    xtype: 'combo',
                    // store: 'Tool.trend.bili.store.RankZoneStore',
                    store: zoneStore,
                    editable: false,
                    displayField: 'name',
                    valueField: 'type',
                    readOnly: me.dto.actionType == 0,
                    emptyText: '请选择...',
                    allowBlank: false
                }, {
                    fieldLabel: '延迟类型',
                    xtype: 'combo',
                    name: 'delayType',

                    valueField: 'type',
                    displayField: 'name',
                    store: 'Tool.trend.bili.store.RankDelayTypeStore',
                    editable: false,

                    emptyText: '请选择...',
                    readOnly: me.dto.actionType == 0,
                    allowBlank: false
                }, {
                    fieldLabel: '延迟',
                    name: 'delay',
                    readOnly: me.dto.actionType == 0,
                    allowBlank: false,
                    xtype: 'numberfield',
                    value: 0,
                    maxValue: 31,
                    minValue: 0
                }, {
                    fieldLabel: '模式',
                    xtype: 'radiogroup',
                    action: 'isStrict',
                    items: [
                        {
                            boxLabel: '严格',
                            name: 'isStrict',
                            inputValue: true,
                            readOnly: me.dto.actionType == 0,
                        }, {
                            boxLabel: '排外',
                            name: 'isStrict',
                            inputValue: false,
                            readOnly: me.dto.actionType == 0,
                        }
                    ],
                    allowBlank: false
                }, {
                    fieldLabel: '执行',
                    xtype: 'radiogroup',
                    action: 'isRun',
                    items: [
                        {
                            boxLabel: '是',
                            name: 'isRun',
                            inputValue: true,
                            readOnly: me.dto.actionType == 0,
                        }, {
                            boxLabel: '否',
                            name: 'isRun',
                            inputValue: false,
                            readOnly: me.dto.actionType == 0,
                        }
                    ],
                    allowBlank: false
                }, {
                    fieldLabel: '展示',
                    xtype: 'radiogroup',
                    action: 'isShow',
                    items: [
                        {
                            boxLabel: '是',
                            name: 'isShow',
                            readOnly: me.dto.actionType == 0,
                            inputValue: true,
                        }, {
                            boxLabel: '否',
                            name: 'isShow',
                            readOnly: me.dto.actionType == 0,
                            inputValue: false,
                        }
                    ],
                    readOnly: me.dto.actionType == 0,
                    allowBlank: false
                }
            ]
        }];


        me.buttons = [{
            text: '新增规则',
            doAction: 'show',
            dto: {
                actionType: 1,
                winXtype: 'trend-bili_rank_rule-win',
            },
            hidden: me.dto.actionType == 0
        }, '->', {
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