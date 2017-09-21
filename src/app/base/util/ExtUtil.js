"use strict";

try {
    Ext.define('Tool.base.util.ExtUtil', {});
} catch (e) {
    console.log(e)
}
class ExtUtil {
    // 默认约定xtype==id
    static getDatasFromGrid(grid) {
        let store = grid.getStore();
        let proxy = store.getProxy();
        let datas = [];
        for (let i = 0; i < proxy.getData().length; i++) {
            let data_ = proxy.getData()[i];
            if (data_.status != -1) {
                // 拷贝，要不然获取的是store数据的引用。。。。
                let data = {};
                for (let f in data_) {
                    data[f] = data_[f];
                }
                datas.push(data);
            }
        }
        return datas;
    };

    static getLogin() {
        let store = Ext.StoreMgr.get('base_login-store');
        let idx = store.find('active', true);
        if (idx < 0) return null;
        let record = store.get(idx);
        return record;
    }

    static confirmLogin() {
        let isLogin = false;
        let record = ExtUtil.getLogin();

        Ext.widget('base_login-win').show();


    }

    static initGridFromCsvContent(grid, datas) {
        let fields = [];
        let cols = [];
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            for (let key in data) {
                if (i == 0) {
                    fields.push(key);
                    cols.push({"text": key, "dataIndex": key});
                }
            }
        }
        let store = Ext.create('Ext.data.Store', {
            fields: fields,
            autoLoad: true,
            // proxy: { type: 'memory', reader: { type: 'json' }, enablePaging: true },
            proxy: new Ext.data.MemoryProxy({data: datas, reader: {type: 'json'}, enablePaging: false}),
            data: datas
        });
        //dynamic add col
        grid.reconfigure(store, cols);
    }

    static gridSelectValidate(grid, tip) {
        if (typeof grid == "string")
            grid = Ext.ComponentQuery.query(grid)[0];

        let record = grid.getSelectionModel().getSelection()[0];
        if (record == null) {
            Ext.widget('tipwin', {
                delay: 1000,
                x: document.body.clientWidth / 2 + 100,
                y: document.body.clientHeight / 2,
                html: tip
            }).show();
            return false;
        }
        return record;

    }

    static storeLoadPage(store, page) {
        return new Promise(function (resolve, reject) {
            store.loadPage(page, {

                scope: this,
                callback: function (records, options, success) {
                    if (success == true) {
                        resolve(records);
                    } else {
                        reject(false);
                    }
                }
            });
        });
    }

    static storeLoad(store) {

        return new Promise(function (resolve, reject) {
            store.load({
                callback: function (records, options, success) {
                    if (success == true) {
                        resolve(records);
                    } else {
                        reject(false);
                    }
                }
            });
        });
    }

    static promiseAll(promises) {
        return new Promise(function (resolve, reject) {
            Promise.all(promises).then(function (posts) {
                resolve(posts);
            }).catch(function (reason) {
                reject(reason);
            });
        });
    }

    static ajaxAsync(url, method, params, headers) {
        if (typeof headers == 'undefined') {
            headers = {
                'Content-Type': 'application/json;charset=UTF-8'
            };
        }
        return new Promise(function (resolve, reject) {
            Ext.Ajax.request({
                headers: headers,
                url: url,
                method: method,
                jsonData: params,
                success: function (resp, opts) {
                    resolve(resp);
                },
                failure: function (resp, opts) {
                    let ret = null;
                    try {
                        ret = JSON.parse(resp.responseText);
                        reject(new Error('code:' + ret.code + '<br>msg:' + ret.msg));
                    } catch (e) {
                        reject(new Error(resp.status + '<br>' + resp.statusText));
                    }

                }
            });

        });
    }

    static reflushGridAndSelect(grid) {
        // 通用 刷新并选中
        if (typeof grid == "string")
            grid = Ext.ComponentQuery.query(grid)[0];

        let store = grid.getStore();
        // 刷新后重新选中
        let selected = grid.getSelectionModel().getLastSelected();
        let idx = grid.getStore().indexOf(selected);
        store.reload({
            scope: this,
            callback: function (records, operation, success) {
                // 取消选中
                grid.getSelectionModel().deselectAll();
                // 重新选择
                grid.getSelectionModel().select(idx);
            }
        });
    }

    static reflushGrid(grid) {
        // 通用 刷新
        if (typeof grid == "string")
            grid = Ext.ComponentQuery.query(grid)[0];

        let store = grid.getStore();
        // 刷新后重新选中
        let selected = grid.getSelectionModel().getLastSelected();
        let idx = grid.getStore().indexOf(selected);
        store.reload({
            scope: this,
            callback: function (records, operation, success) {
                // 取消选中
                grid.getSelectionModel().deselectAll();
                // 重新选择
                grid.getSelectionModel().select(idx);
            }
        });
    }

    static addNewTabpanel(tabpanel, xtype, dto) {
        // alert('new')
        let pan = null;
        let id = xtype;
        let oldItems = Ext.ComponentQuery.query(xtype);
        oldItems.forEach(function (component) {
            tabpanel.remove(component);
        });
        pan = Ext.widget(xtype);
        if (dto != 'undefined') {
            pan.dto = dto
        }
        tabpanel.add(pan);
        tabpanel.setActiveTab(id);
        return pan;
    }

    static addOrActiveTabpanel(tabpanel, xtype, dto) {
        // alert('cache')
        let pan = null;
        let id = xtype;
        let oldItems = Ext.ComponentQuery.query(xtype);
        if (oldItems.length == 0) {
            pan = Ext.widget(xtype);
            if (dto != 'undefined') {
                pan.dto = dto;
            }
            tabpanel.add(pan);
            // alert('cache:false')
        } else {
            // alert('cache:true')
            pan = oldItems[0];
        }
        tabpanel.setActiveTab(id);
        return pan;
    }

    static showTip(tip) {
        Ext.widget('tipwin', {
            delay: 2000,
            x: document.body.clientWidth / 2 + 100,
            y: document.body.clientHeight / 2 - 50,
            html: tip
        }).show();


    }

    static getIframeWindowById(id) {
        let iframe_ = document.getElementById(id);
        let win = null;
        if (iframe_ != null && typeof(iframe_) != 'undefined') {
            win = iframe_.contentWindow;
        }
        return win;
    }

    static deleteNode(xtype, id) {
        // 删除
        let store = Ext.ComponentQuery.query(xtype)[0].getStore();
        let node = store.getNodeById(id);
        let pid = node.parentNode.data.id;
        node.remove();
        let pNode = store.getNodeById(pid)
        if (!pNode.hasChildNodes()) {
            let pRecord = store.getById(pid);
            pRecord.set('leaf', true);
            pRecord.commit();
        }

    }

    static getRestModelProxyTpl(urlModel, idArray, config, type) {
        let rootProperty = 'list'; // 默认是普通store
        if (typeof (type) != 'undefined' && type == 'tree') {
            rootProperty = 'children';
        }
        let returnConfig = {
            headers: {
                'Authorization': 2131231
            },
            type: 'rest',
            appendId: true,
            actionMethods: {
                create: 'POST',
                read: 'GET',
                update: 'PUT',
                destroy: 'DELETE'
            },
            url: urlModel,
            reader: {
                type: 'json',
                transform: {
                    fn: function (data) {
                        let returnData = null;

                        // 处理数据前的预处理。提取数据给框架用
                        try {
                            let success = data.code == 0;
                            if (typeof (data.data.children) != 'undefined') {
                                //TODO tree 的 children
                                data.success = success;
                                data.children = data.data.children;
                                returnData = data;
                            } else if (Array.isArray(data.data.list)) {
                                data.data.success = success;
                                returnData = data.data;
                            } else {
                                data.success = success;
                                data.list = data.data;
                                returnData = data;
                            }

                        } catch (e) {
                            returnData = data;
                        }

                        console.info('processJson:');//TODO cs
                        console.log(returnData);
                        return returnData;

                    },
                    scope: this
                },
                rootProperty: rootProperty,
                totalProperty: 'total',//TODO
                successProperty: 'success'
            },
            writer: {
                type: 'json',
                writeAllFields: true // 要开启，否则rest.put 有问题
            },
            buildUrl: function (req) {
                let me = this;
                let config = req.getConfig();
                let operation = req.getOperation();
                let records = operation.getRecords() || [];
                let record = records.length > 0 ? records[0] : null;
                let url = me.getUrl(req);
                let id = null;
                if (typeof (record) != 'undefined' && record != null && typeof (record.id) != 'undefined' && record.id != null && Ext.String.trim(record.id + '') != '') {
                    id = record.id;
                } else if (typeof (config.params.id) != 'undefined' || config.params.id != null || Ext.String.trim(config.params.id + '') != '') {
                    id = config.params.id;
                }

                if (typeof (id) == 'undefined' || id == null || Ext.String.trim(id + '') == '') {
                    id = null;
                    try {
                        record.set('id', null);
                    } catch (e) {
                    }
                }


                if (me.isValidId(id)) {
                    if (id != null) {
                        url = url.replace(':id', id);
                    }
                    // 替换模板
                    for (let i = 0; i < idArray.length; i++) {
                        // console.log(req.getConfig().params)
                        // console.log(config.params)
                        url = url.replace(':' + idArray[i], req.getConfig().params[idArray[i]]);
                    }
                } else {
                    console.log('getRestModelProxyTpl:id=' + id);
                    throw new Error('A valid id is required');
                }
                if (this.appendId == true && me.isValidId(id) && id != null && req.getAction() != 'create') {
                    url += '/' + encodeURIComponent(id);
                }


                let reqJson = null;
                try {
                    reqJson = JSON.stringify(config.params);
                } catch (e) {

                } finally {
                    console.info(req.getAction() + ':id=' + id + ':url=' + url + '\njson=' + reqJson);
                }
                return url;
            },
            listeners: {

                exception: function (proxy, response, options) {
                    let responseData = {};
                    let status = response.status;
                    if (typeof status == 'undefined' || status == 0) {
                        Ext.MessageBox.show({
                            title: '〇',
                            msg: '<span style="color:red;font-weight: bold;">电波传送到了异次元</span>',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    } else {
                        try {
                            responseData = proxy.reader.getResponseData(response);
                        } catch (e) {
                            console.error(e);
                        }


                        Ext.MessageBox.show({
                            title: 'Error',
                            msg: '<span style="color: #999">status:' + status + '&nbsp;&nbsp;&nbsp;code:' +
                            responseData.code + '</span><br><span style="color:red;font-weight: bold;">' +
                            responseData.msg + '</span>',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }

                }
            },
            isValidId: function (id) {
                return id == null ? true : (/^\d+$/.test(id) ? true : false);
            }

        };
        if (typeof (config) != 'undefined' && config != null)
            Ext.apply(returnConfig, config);

        return returnConfig;
    }

    static initIndexView_buildOne(module, col) {
        if (typeof col == 'undefined') {
            col = 3;
        }
        // height:70
        let data = {};
        let {buttons, text, icon} = module;


        let row_size = Math.ceil(buttons.length / col);
        let totalHeight = row_size * (70 + 20) + 40;// 70 高度+padding/margin高度 + title高度

        let hboxItems = [];
        let hboxItemTmp = null;

        buttons.forEach(function (component, index) {

            let icon = AT.app.folder + component.icon;
            if (/^data/.test(component.icon)) {
                // base64 图片
                icon = component.icon;
            }
            let but = {
                dto: {
                    text: component.text,
                    icon: component.icon
                },
                items: [
                    {
                        xtype: 'box',
                        width: 70,
                        height: 70,
                        autoEl: {
                            tag: 'img',
                            src: icon
                            // src:
                        }
                    }, {
                        xtype: 'label',
                        style: 'line-height:70px;margin-left:10px;font-size:14px;font-weight:bold;cursor:pointer;',
                        action: 'title',
                        text: component.text
                    }
                ]
            };

            if (typeof (component.dto) != 'undefined') {
                Object.assign(but.dto, component.dto);
            }

            if (typeof(component.toModule != 'undefined')) {
                but.toModule = component.toModule;
            } else if (typeof(component.toSubsys != 'undefined')) {
                but.toSubsys = component.toSubsys;
            } else if (typeof(component.toWin != 'undefined')) {
                but.toWin = component.toWin;
            }

            if (index % col == 0) {
                // 新建
                hboxItemTmp = {
                    items: []
                };
                hboxItemTmp.items.push(but);
            } else if (index % col < col - 1) {
                // 丢入新建
                hboxItemTmp.items.push(but);

            } else {
                // 丢入新建
                hboxItemTmp.items.push(but);
                hboxItems.push(hboxItemTmp);
            }

        });
        if (buttons.length % col != 0) {
            hboxItems.push(hboxItemTmp);
        }


        data = {
            xtype: 'container',
            style: 'background:white',
            height: totalHeight,
            layout: 'border',
            border: false,
            bodyBorder: false,
            items: [
                {
                    region: 'north',
                    xtype: 'container',
                    border: false,
                    bodyBorder: false,
                    padding: '30 0 0 30',
                    items: {
                        xtype: 'label',
                        html: '<span style="color: grey;font-weight:bold ;">' + text + '</span>'
                    }

                }, {
                    region: 'center',
                    style: 'background:#fff;',
                    xtype: 'container',
                    height: 100,
                    layout: {type: 'vbox', align: 'stretch'},
                    padding: '0 0 0 10',
                    defaults: {
                        margin: '10 0 0 0',
                        xtype: 'container',
                        layout: {type: 'hbox', align: 'stretch'},
                        defaults: {
                            xtype: 'container',
                            // toRoute: true,
                            listeners: {
                                mouseleave: {
                                    element: 'el',
                                    fn: function (e, t, eOpts) {
                                        t.style.color = "#222";
                                    }
                                },
                                mouseenter: {
                                    element: 'el',
                                    fn: function (e, t, eOpts) {
                                        t.style.color = "#ff8f42";
                                    }
                                },
                                click: {
                                    element: 'el',
                                    fn: function (e, t, eOpts) {
                                        let component_ = this.component;
                                        component_.fireEvent('click', component_, e, eOpts);
                                    }
                                },
                            },
                            width: (100 / col) + '%',
                            layout: {type: 'hbox', align: 'stretch'},
                            padding: '0 10 10 10',
                            style: 'border-radius:0px;margin-right:5px;cursor:pointer;hover:{color:#E98200}',
                            defaults: {
                                style: 'cursor:pointer;',
                            },

                        },

                    },
                    items: hboxItems

                }

            ]
        };
        return data;


    }

    /**
     * 首页初始化模板
     * @param me controller的this
     * @param datas 参数
     */
    static initIndexView(me, modulesObj, col) {
        me.xtype = 'panel';
        me.layout = 'fit';
        me.border = false;
        me.bodyBorder = false;
        me.items = {
            border: false,
            bodyBorder: false,
            scrollable: true,
            layout: {type: 'vbox', align: 'stretch'},
            items: []
        };
        for (let moduleXtype in modulesObj) {
            let data = ExtUtil.initIndexView_buildOne(modulesObj[moduleXtype], col);
            me.items.items.push(data);
        }
    }


    // ///////////////////////////////////////TODO 三态树的实现，有问题
    static checkParentNode(node, checked) {

        var me = ExtUtil;
        node.set('checked', checked);
        // 父节点
        if (node.parentNode != null) {
            me.checkParentNode(node.parentNode, checked);
        }

        // 这里是测试，不包含extjs框架中的root
        else {
            node.set('checked', false);

        }
    }

    static checkChildrenNode(node, checked) {
        var me = ExtUtil;
        node.set('checked', checked);
        if (node.childNodes.length != 0) {
            var i;
            var l = node.childNodes.length;
            for (i = 0; i < l; i++) {
                me.checkChildrenNode(node.childNodes[i], checked);
            }
        }
    }

    static checkEqualNode(node) {

        var me = ExtUtil;
        if (node.parentNode == null)
            return;
        var equalNodeList = node.parentNode.childNodes;
        if (equalNodeList.length != 0) {
            var i;
            var flag = false;
            for (i = 0; i < equalNodeList.length; i++) {
                if (equalNodeList[i].get('checked'))
                    flag = true;

            }
            me.checkParentNode(node.parentNode, flag);
        }
        me.checkEqualNode(node.parentNode);
    }

    static changeTreeState(node, checked, eOpts) {
        var me = ExtUtil;
        // 三态树的实现
        // TODO 三态树的实现
        me.checkChildrenNode(node, checked);
        me.checkEqualNode(node);
    }

    static splitNumber(num) {

        let me = ExtUtil;
        let data = parseInt(num + "");
        let result = parseInt((data / 1000) + "");
        let remain = data % 1000;
        let dataStr = "";
        if (result >= 1) {
            if (remain >= 100) {
                dataStr = me.splitNumber(result) + "," + remain;
            } else if (remain >= 10) {
                dataStr = me.splitNumber(result) + ",0" + remain;
            } else {
                dataStr = me.splitNumber(result) + ",00" + remain;
            }
        } else {
            dataStr = remain + "";
        }
        return dataStr;

    };


}
