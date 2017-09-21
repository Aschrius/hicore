Ext.define('Tool.trend.DesktopIndexStore', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    storeId: 'trend-desktop_index-store',
    pageSize: 10,
    fields: [
        {
            name: 'info',
            convert: function (value, record) {
                let batchNo = record.get('batchNo');
                let status = record.get('status');
                let statusStore = Ext.StoreMgr.get('trend-bili_index_status-store');
                let index = statusStore.find('id', status);
                let re = statusStore.getAt(index);
                let name = re.get('name');

                return `${batchNo} * ${name}`;
            }
        }
    ],
    proxy: Tool.base.ux.BaseRestProxy.create({
        url: AT.app.server + '/trend/bili/rank/:rankId/index',
        idArray: ['rankId']
    })
});
