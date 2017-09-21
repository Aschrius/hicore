Ext.define('Tool.box.code.view.PackPan', {
    extend: 'Ext.panel.Panel',
    title: '补丁',
    id: 'box-code_pack-pan',
    alias: 'widget.box-code_pack-pan',
    initComponent: function () {
        let me = this;

        let projectPath = localStorage.getItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_PRO_PATH);
        if (typeof(projectPath) == 'undefined') {
            projectPath = '';
        }

        let outputPath = localStorage.getItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_EXP_PATH);
        if (typeof(outputPath) == 'undefined') {
            outputPath = '';
        }

        me.layout = 'border';
        me.border = false;
        me.bodyBorder = false;
        me.items = [{
            region: 'north',
            // title: '设置',
            xtype: 'form',
            // split: true,
            // collapsible: true,
            action: 'config',
            border: false,
            bodyBorder: false,
            style: {
                background: "#fff"
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            // defaults: { padding: 5, margin: 1 },
            items: [{
                xtype: 'panel',
                layout: 'hbox',
                border: false,
                bodyBorder: false,
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        border: false,
                        bodyBorder: false,
                        dock: 'top',

                        items: [
                            {
                                xtype: 'textfield',
                                labelWidth: 60,
                                width: '80%',
                                name: 'projectPath',
                                value: projectPath,
                                labelAlign: 'right',
                                fieldLabel: '工程目录',
                            },
                            {
                                width: '10%',
                                doAction: 'doAna',
                                text: '目录解析'
                            },
                            {
                                width: '10%',
                                toWin: 'box-code_svn-win',
                                text: 'SVN辅助',
                                dto: {},
                                fn: async function (dto) {

                                    let mask = new Ext.LoadMask(Ext.ComponentQuery.query('mvcview')[0], {
                                        msg: "正在获取SVN信息..."
                                    });
                                    mask.show();

                                    try {

                                        let projectPathCom = Ext.ComponentQuery.query('box-code_pack-pan textfield[name=projectPath]')[0];
                                        let projectPath = projectPathCom.getValue().trim();

                                        let ret = await ShellUtil.execute('svn_info.cmd', 'svn info ' + projectPath);
                                        ret.split('\r\n').forEach(function (val) {
                                            if (val.startsWith('URL: ')) {
                                                dto.url = decodeURI(val.substr(5));
                                            } else if (val.startsWith('Relative URL:')) {
                                                dto.relative_url = decodeURI(val.substr(15));
                                            } else if (val.startsWith('svn: E')) {
                                                ExtUtil.showTip('非SVN目录');
                                            }
                                        });

                                        dto.password = localStorage.getItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_PASSWORD);
                                        dto.username = localStorage.getItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_USERNAME);
                                        dto.src= localStorage.getItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_SRC);
                                        dto.classes= localStorage.getItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_CLASSES);

                                    } catch (e) {
                                        console.error(e);
                                    } finally {
                                        mask.hide();
                                    }

                                }

                            }
                        ]
                    },
                    {
                        xtype: 'toolbar',
                        hidden: true,
                        border: false,
                        bodyBorder: false,
                        dock: 'top',
                        layout: 'hbox',
                        items: [{
                            xtype: 'textfield',
                            labelWidth: 60,
                            width: '30%',
                            name: 'total',
                            labelAlign: 'right',
                            editable: false,
                            fieldLabel: 'total',
                        },
                            {
                                xtype: 'textfield',
                                labelWidth: 60,
                                width: '30%',
                                name: 'size',
                                labelAlign: 'right',
                                editable: false,
                                fieldLabel: 'size',
                            },
                            {
                                xtype: 'textfield',
                                labelWidth: 60,
                                width: '30%',
                                name: 'progress',
                                labelAlign: 'right',
                                editable: false,
                                fieldLabel: 'progress',
                            }]
                    }]

            }]

        },
            {
                region: 'center',
                xtype: 'treepanel',
                rootVisible: false,
                buttonAlign: 'center',
                buttons: [{
                    xtype: 'textfield',
                    labelWidth: 60,
                    width: '80%',
                    name: 'outputPath',
                    value: outputPath,
                    labelAlign: 'right',
                    fieldLabel: '导出目录',
                },
                    {
                        text: '导出',
                        doAction: 'doExport'
                    }],
                title: '文件目录树',
                store: Ext.create('Ext.data.TreeStore', {

                    root: {
                        expanded: true,
                        checked: false,
                        children: []
                    },
                    proxy: {
                        type: 'memory',
                        reader: {
                            type: 'json',
                            root: 'children'
                        }
                    }

                })

            }];
        me.callParent(arguments);


    }
});

