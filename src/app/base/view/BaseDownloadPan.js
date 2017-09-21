Ext.define('Tool.base.view.BaseDownloadPan', {
  extend: 'Ext.panel.Panel',
  id: 'basedownloadpan',
  title: 'BaseDownloadPan',
  alias: 'widget.basedownloadpan',
  initComponent: function() {
    var me = this;

    var css=document.createElement("style");
    css.setAttribute("type", "text/css");
    css.innerHTML = " .basedownload_refresh { background: url(" +
      location.href + "/base/res/basedownload_refresh.png" +
      "); }" +
      document.getElementsByTagName("head")[0].appendChild(css);

    var store = Ext.create('Ext.data.Store', {
      fields: [
        'id',
        'tmpPath',
        'filePath',
        'name',
        'size',
        'progress',
        'status',
        'url',
      ],
      idProperty: 'id',
      data: {
        'items': []
      },
      proxy: {
        type: 'memory',
        reader: {
          type: 'json',
          root: 'items'
        }
      }
    });

    me.resizable = false;
    me.modal = true;
    me.closable = false;

    me.maximized = true;
    me.layout = 'border';
    me.border = false;
    me.bodyBorder = false;
    me.items = [
      {
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
        layout: { type: 'vbox', align: 'stretch' },
        // defaults: { padding: 5, margin: 1 },
        items: [
          {
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
                layout: 'hbox',
                items: [
                  {
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
                    name: 'wait',
                    labelAlign: 'right',
                    editable: false,
                    fieldLabel: 'wait',
                  }, {
                    xtype: 'textfield',
                    labelWidth: 60,
                    width: '30%',
                    name: 'progress',
                    labelAlign: 'right',
                    editable: false,
                    fieldLabel: 'progress',
                  }
                ]
              },{
                xtype: 'toolbar',
                border: false,
                bodyBorder: false,
                dock: 'top',
                items: [
                  {
                    xtype: 'progressbar',
                    action:'progress',
                    width: '100%'
                  }
                ]
              }]


          }
        ]

      },
      {
        region: 'center',
        xtype: 'grid',
        border: false,
        //bodyBorder: false,
        sortableColumns: false,
        disableSelection: true,
        enableColumnMove: false,
        title: null,
        action:'baseDownloadGrid',
        store: store,
        columns: [
          { xtype: 'rownumberer', width: 60 },
          {
            header: 'Name',
            dataIndex: 'name',
            width: 220
          },
          {
            header: 'Size',
            dataIndex: 'size',
            width: 120
          },
          {
            header: 'progress',
            minWidth: 60,
            dataIndex: 'progress',
            xtype: 'gridcolumn',
            flex: 1,
            renderer: function(value) {
              var val = parseInt(value, 10);
              return "<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #8DB2E3 solid;'><div style='height:12px;width:" + val + "%;background-color:#8DB2E3;border: 0px;color: black;'>" +
                val + "%</div></div>";
            }

          },
          {
            header: 'status',
            dataIndex: 'status',
            width: 60,
            renderer: function(value) {
              switch (value) {
                case 1: value = '<span style="color:green">成功</span>'; break;
                case 0: value = '<span style="color:#666">等待</span>'; break;
                case 2: value = '<span style="color:#111">进行</span>'; break;
                case -1: value = '<span style="color:red">失败</span>'; break;
                default: value = ''
              }
              return value;
            }

          },
          {
            xtype: "actioncolumn",
            width: 30,
            items: [
              {
                iconCls: 'basedownload_refresh',
                tooltip: '重置',
                handler: function(grid, rowIndex, colIndex, item) {
                  var rec = grid.getStore().getAt(rowIndex);
                  this.fireEvent('reDownload', {
                    record: rec
                  });
                }
              }
            ]

          }

        ]
      }
    ];

    me.callParent(arguments);



  }
});

