Ext.define('Cover.view.MvcView', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.mvcview',
    initComponent: function () {

        var gui = require('nw.gui');
        var app = gui.App;
        var win = gui.Window.get();
        var exec = require('child_process').exec;


        var leftNav = [];
        for(var appName in apps){
            leftNav.push({
                toApp: appName+'pan',
                baseCls: 'x-btn ' + appName + '-button',
                overCls: appName + '-button-over'
            });
        }

        // {
        //     toApp: 'hipxpan',
        //     baseCls: 'x-btn hipx-button',
        //     overCls: 'hipx-button-over',
        // }

        var me = this;
        me.layout = 'fit';
        me.items = [{
            xtype: 'panel',
            tools: [{
                type: 'refresh', qtip: '刷新',
                handler: function (event, toolEl, panel) {
                    win.reloadIgnoringCache();
                }
            }, {
                    type: 'help', qtip: '帮助',
                    handler: function (event, toolEl, panel) {
                        // var cmdStr = 'start http://weibo.com/u/5401688104';
                        // exec(cmdStr, function (err, stdout, stderr) { });
                        extUtil.showTip('Copyright © 2014 - 2016 eylsun. All Rights Reserved. ');
                    }
                }, {
                    type: 'close', qtip: '关闭',
                    handler: function (event, toolEl, panel) {
                        //app.clearCache();
                        win.close();
                    }
                }],
            title: '<div style="float:left;-webkit-user-select:none;-webkit-app-region:drag;;line-height: 20px;width:100%;font-size:20px;">ATools</div>',
            layout: 'border',
            border: false,
            bodyBorder: false,
            items: [
                {
                    region: 'center',
                    tabPosition: 'left',
                    xtype: 'tabpanel',
                    layout: 'fit',
                    border: false,
                    bodyBorder: false,
                    style: {
                        background: "#fff"
                    },
                    items: [
                        {
                            xtype: 'panel',
                            layout:'vbox',
                            title:'desc',
                            defaults: {
                                padding: '50 0 0 50'
                            },
                            items: [
                                {
                                    xtype:'label',
                                    text:'天坑失败！看初代萌王停不下来！'
                                },{
                                    xtype:'label',
                                    html:'2016-04-24 &nbsp; <img width="20px" height="20px" src="'+window['_proPath']+'assets/favicon.png'+'"></img>'
                                }
                            ]
                        }

                    ]
                },
                {
                    region: 'west',
                    xtype: 'container',
                    style: {
                        background: "#eaeaea"
                    },
                    layout: { type: 'vbox', align: 'stretch' },
                    defaults: { 
                        text: '',
                        xtype: 'button',
                        border: false,
                        bodyBorder: false,
                        width: 43, 
                        height: 43, margin: '10 5 0 5' },
                    text: '',

                    items: [].concat(leftNav)
                }, {
                    region: 'south',
                    hidden: true,
                    xtype: 'container',
                    padding: 4,
                    items: [
                        {
                            xtype: 'label',
                            html: '<div style="font-size: 10px;text-align: center;color: #666;width:100%"> Copyright © 2014 - 2016 eylsun. All Rights Reserved. </div>'
                        }
                    ]
                }
            ]

        }];

        me.callParent(arguments);

    }
});
