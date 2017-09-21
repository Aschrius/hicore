Ext.define('Tool.box.pixiv.view.IllustPan', {
    extend: 'Ext.panel.Panel',
    id: 'box-pixiv_illust-pan',
    alias: 'widget.box-pixiv_illust-pan',
    title: '作品',
    initComponent: function () {

        let store = Ext.StoreMgr.get('box-pixiv_illust-store');
        let me = this;
        me.closable = false;
        me.layout = 'border';
        me.border = false;
        me.bodyBorder = false;
        me.items = [
            {
                xtype: 'panel',
                region: 'north',
                layout: 'hbox',
                border: false,
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
                        width: 330,
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
                                        style: 'font-weight:bold',
                                        text: 'name'
                                    }, {
                                        xtype: 'label',
                                        action: 'member_id',
                                        style: 'color:grey;',
                                        text: 'member_id'
                                    }, {
                                        xtype: 'label',
                                        style: 'color:grey;',
                                        action: 'total',
                                        text: 'total'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        style: 'margin-top:15px;margin-left:25px;margin-right:25px;',
                        xtype: 'button',
                        doAction: 'doUpdate',
                        text: '更新'

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
                dockedItems: {
                    xtype: 'pagingtoolbar',
                    store: store,
                    dock: 'bottom',
                    displayInfo: false,
                },
                columns: [
                    {
                        xtype: 'rownumberer', width: 50
                    }, {
                        dataIndex: 'name',
                        flex: 1,
                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                            let date = record.get('update_date');
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
                            let member_id = record.get('member_id');
                            let id = record.get('id');
                            let cover = AT.app.path + '/../_pixiv/' + member_id + '/cover/' + record.get('cover');
                            let title = record.get('title');

                            let ret = `
                                <div style="padding:5px;width:100%;height:50px;"> 
                                    <div style="float:left"> 
                                        <img style="border-radius:10px" width="50" height="50" src="${cover}"> 
                                    </div> 
                                    <div style="float:left;margin-left:50px;width:10%;"> 
                                        <div style="padding:4px;font-weight:bold;font-size:18px;">${title}</div> 
                                        <div style="padding:4px;color:#aaa;">${id}</div> 
                                    </div> 
                                    <div style="float:left;margin-left:50px;width:10%;"> 
                                        <div style="padding:4px;font-weight:bold;font-size:18px;">&nbsp;</div> 
                                        <div style="padding:4px;font-size:14px;color: #aaa">${type} </div> 
                                    </div> 
                                    <div style="float:left;margin-left:50px;width:10%;"> 
                                        <div style="padding:4px;font-weight:bold;font-size:18px;">&nbsp;</div> 
                                        <div style="padding:4px;font-size:14px;color: #aaa">${date} </div> 
                                    </div> 
                                </div>
                             `;
                            return ret;
                        }
                    }
                ]
            }
        ];

        me.callParent(arguments);
    }
});

