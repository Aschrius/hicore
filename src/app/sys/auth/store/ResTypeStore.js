Ext.define('Tool.sys.auth.store.ResTypeStore', {
    extend: 'Ext.data.Store',
    fields: [
        'display', 'value'
    ],
    data: [
        {value: 0, display: '系统'},
        {value: 1, display: '子系统'},
        {value: 2, display: '模块'},
        {value: 3, display: '功能（菜单）'},
        {value: 4, display: '操作'},
        {value: 5, display: '功能分类'},
    ],
    proxy: {type: 'memory', reader: {type: 'json'}, enablePaging: true}
})
;
