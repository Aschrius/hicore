Ext.define('Tool.trend.bili.view.ExpCsvGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.trend-bili_expcsv-grid',
    id: 'trend-bili_expcsv-grid',
    dto: {
        showType: 0// 0: tag数据源管理 ; 1: index选择数据源用 ; 2:查看index下的数据文件
    },
    initComponent: function () {
        let zoneStore = Ext.StoreMgr.get('trend-bili_rankzone-store');
        let expCsvStatusStore = Ext.StoreMgr.get('trend-bili_expcsv_status-store');


        let me = this;
        this.border = false;
        this.columns = [{
            xtype: 'rownumberer',
            flex: 1
        }, {
            text: '编号',
            dataIndex: 'id',
            width: 50
        }, {
            text: '创建',
            dataIndex: 'createDate',
            width: 130
        }, {
            text: '更新',
            dataIndex: 'updateDate',
            width: 130
        }, {
            text: '旧编',
            dataIndex: 'oldBatchNo',
            hidden: me.dto.showType == 2,
            flex: 3
        }, {
            text: '旧',
            dataIndex: 'oldDate',
            hidden: me.dto.showType == 2,
            flex: 3,
            width: 130
        }, {
            text: '新编',
            dataIndex: 'newBatchNo',
            hidden: me.dto.showType == 2,
            flex: 3
        }, {
            text: '新',
            dataIndex: 'newDate',
            hidden: me.dto.showType == 2,
            width: 130
        }, {
            text: '类型',
            dataIndex: 'type',
            width: 50
        }, {
            text: '状态',
            dataIndex: 'status',
            width: 50,
            renderer: function (value) {
                let name = value;
                try {
                    let index = expCsvStatusStore.find('id', value);
                    let record = expCsvStatusStore.getAt(index);
                    name = record.get('name');
                } catch (e) {
                    console.log(e);
                }
                return name;


            }

        }, {
            text: '备份',
            dataIndex: 'backup',
            width: 50,
            renderer: function (value) {
                return value == true ? '<span style="color: green">是</span>' : '<span style="color: red;">否</span>'
            }
        }, {
            text: '本地',
            dataIndex: 'isExist',
            width: 50,
            renderer: function (value) {
                return value == true ? '<span style="color: green">存</span>' : '<span style="color: red;">无</span>'
            }
        }, {
            text: '区',
            dataIndex: 'zoneId',
            hidden: me.dto.showType == 2,
            width: 100,
            renderer: function (value) {
                try {

                    // console.log(value)
                    let idx = zoneStore.find('type', value);
                    // console.log(idx)
                    return zoneStore.getAt(idx).get('name');
                } catch (e) {
                    console.error(e)
                }
            }
        }];
        this.callParent();
    }
}); 