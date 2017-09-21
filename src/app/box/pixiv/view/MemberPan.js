Ext.define('Tool.box.pixiv.view.MemberPan', {
    extend: 'Ext.panel.Panel',
    id: 'box-pixiv_member-pan',
    alias: 'widget.box-pixiv_member-pan',
    title: '关注',
    initComponent: function () {

        let store = Ext.StoreMgr.get('box-pixiv_member-store');

        let me = this;
        me.closable = false;
        me.layout = 'border';
        me.border = false;
        me.bodyBorder = false;
        me.items = [
            {
                xtype: 'panel',
                region: 'north',
                border: false,
                items: [
                    {
                        style: 'margin-top:15px;margin-left:25px;margin-right:25px;',
                        xtype: 'button',
                        doAction: 'doUpdatePage',
                        text: '更新本页'

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
                        dataIndex: 'avatar',
                        flex: 1,
                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {

                            let ret = null;
                            try {
                                let date = record.get('update_date');

                                let avatar = AT.app.path + '/../_pixiv/' + record.get('id') + '/' + record.get('avatar');
                                let name = record.get('name');
                                let id = record.get('id');


                                ret = `
                                    <div style="padding:3px;width:100%;height:50px;"> <div style="float:left">
                                        <img style="border-radius:10px" width="50" height="50" src="${avatar}"></div> 
                                        <div style="float:left;margin-left:50px;width:10%;"> 
                                            <div style="padding:4px;font-weight:bold;font-size:18px;">${name}</div> 
                                            <div style="padding:4px;color:#aaa;">${id}</div> 
                                        </div> 
                                        <div style="float:left;margin-left:50px;width:10%;"> 
                                            <div style="padding:2px;font-size:14px;"> 
                                            <div style="padding:4px;font-weight:bold;font-size:18px;">&nbsp;</div> 
                                                <div style="padding:4px;color:#bbb;">${date}</div> 
                                            </div> 
                                        </div>
                                    </div>
                                `;
                            } catch (e) {
                                console.error(e);
                            }
                            return ret;
                        }
                    }
                ]
            }
        ];

        me.callParent(arguments);
    }
});

