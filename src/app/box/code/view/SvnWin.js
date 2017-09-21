Ext.define('Tool.box.code.view.SvnWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.box-code_svn-win',
    id: 'box-code_svn-win',
    dto: {
        url: null,
        relative_url: null,

        username: null,
        password: null
    },
    initComponent: function () {

        let me = this;
        let iconCls = 'Vcard';


        let from = new Date();
        from.setDate(1);
        from.setHours(0);
        from.setMilliseconds(0);
        from.setSeconds(0);
        from.setMinutes(0);

        let to = new Date();
        to.setDate(1);
        to.setHours(0);
        to.setMilliseconds(0);
        to.setSeconds(0);
        to.setMinutes(0);
        to = Ext.Date.add(to, Ext.Date.MONTH, 1);
        to = Ext.Date.add(to, Ext.Date.DAY, -1);


        me.title = '<span style="font-weight: bold;">SVN信息</span>';
        me.resizable = true;
        me.modal = true;
        me.iconCls = iconCls;
        me.width = 400;
        me.items = [{
            xtype: 'form',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                labelAlign: 'left',
                labelWidth: 100,
                xtype: 'textfield',
                margin: '2 10 2 10'
            },
            items: [
                {
                    title: 'SVN',
                    xtype: 'fieldset',
                    collapsible: false,//可以展示伸缩的按钮
                    defaultType: 'textfield',
                    defaults: {
                        anchor: '95%'
                    },
                    items: [
                        {
                            name: 'url',
                            fieldLabel: 'url',
                            value: me.dto.url,
                            allowBlank: false
                        }, {
                            name: 'relative_url',
                            fieldLabel: 'relative_url',
                            value: me.dto.relative_url,
                            allowBlank: false
                        }, {
                            fieldLabel: 'username',
                            name: 'username',
                            value: me.dto.username,
                            allowBlank: false
                        }, {
                            fieldLabel: 'password',
                            value: me.dto.password,
                            name: 'password',
                            allowBlank: false
                        }, {
                            fieldLabel: 'author',
                            name: 'author',
                            value: me.dto.username,
                            allowBlank: true
                        }, {
                            fieldLabel: 'msg(正则匹配)',
                            name: 'msg',
                            allowBlank: true
                        }, {
                            fieldLabel: 'from',
                            name: 'from',
                            allowBlank: false,
                            xtype: 'datefield',
                            editable: true,
                            emptyText: '--请选择--',
                            format: 'Y-m-d',
                            altFormats: 'Y-m-d',
                            value: from

                        }, {
                            fieldLabel: 'to',
                            name: 'to',
                            allowBlank: false,
                            xtype: 'datefield',
                            editable: true,
                            emptyText: '--请选择--',
                            format: 'Y-m-d',
                            altFormats: 'Y-m-d',
                            value: to
                        }

                    ]
                },
                {
                    title: '项目',
                    xtype: 'fieldset',
                    collapsible: true,//可以展示伸缩的按钮
                    defaultType: 'textfield',
                    defaults: {
                        anchor: '95%'
                    },
                    items: [
                        {
                            xtype: 'checkboxgroup',
                            name: 'type',
                            columns: 2,  //在上面定义的宽度上展示3列
                            fieldLabel: '类型',
                            items: [
                                {boxLabel: 'java', name: 'java', checked: 1}
                            ]
                        },
                        {
                            name: 'src',
                            fieldLabel: 'src',
                            value: me.dto.src,
                            allowBlank: false
                        }, {
                            fieldLabel: 'classes',
                            value: me.dto.classes,
                            name: 'classes',
                            allowBlank: true
                        }

                    ]
                }

            ]
        }];

        me.buttons = [{
            text: 'do check',
            doAction: 'doCheckBySvn',
        }];


        me.callParent(arguments);
    }
});