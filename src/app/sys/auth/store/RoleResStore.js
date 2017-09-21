"use strict";
Ext.define('Tool.sys.auth.store.RoleResStore', {
    extend: 'Ext.data.TreeStore',
    model: 'Tool.sys.auth.model.RoleResModel',

    root: {
        id: 1,
        expanded: false,
        text: "授权资源树",
        // defaultRootProperty: 'children',
    },

    /**
     * @cfg {Boolean} rootVisible `false` to not include the root node in this Stores collection.
     * @accessor
     */
    // rootVisible: true,

    /**
     * @cfg {String} [defaultRootProperty="children"]
     */
    // defaultRootProperty: 'children',
    // parentIdProperty: 'pid',

    // clearOnLoad: true,
    // clearRemovedOnLoad: true,

    /**
     * @cfg {String} [nodeParam="node"]
     * The name of the parameter sent to the server which contains the identifier of the node.
     */
    // nodeParam: 'node',

    // defaultRootId: 1,
    // defaultRootText: '授权资源树',

    /**
     * @cfg {Boolean} [folderSort=false]
     * Set to true to automatically prepend a leaf sorter.
     */
    // folderSort: false
    // },


});