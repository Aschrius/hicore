"use strict";
Ext.define('Tool.box.code.controller.PackController', {
    extend: 'Tool.base.controller.MvcController',
    statics: {
        LOCAL_STORAGE_KEY_PRO_PATH: 'hiatproject_projectPath',
        LOCAL_STORAGE_KEY_EXP_PATH: 'hiatproject_outputPath',
        LOCAL_STORAGE_KEY_LAST_EXP_PATH: 'hiatproject_lastoutputPath',
        LOCAL_STORAGE_KEY_IDS: 'hiatproject_ids',
        LOCAL_STORAGE_KEY_PASSWORD: 'hiatproject_password',
        LOCAL_STORAGE_KEY_USERNAME: 'hiatproject_username',
        LOCAL_STORAGE_KEY_SRC: 'hiatproject_src',
        LOCAL_STORAGE_KEY_CLASSES: 'hiatproject_classes',
    },
    views: [
        'Tool.box.code.view.PackPan',
        'Tool.box.code.view.SvnWin'
    ],
    stores: [],
    models: [],
    requires: [
        'Tool.base.util.ExtUtil',
        'Tool.base.util_node.ExtFileUtil',
        'Tool.base.util_node.FileUtil',
        'Tool.base.util_node.ShellUtil',
    ],
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        let self = this;
        self.control({
            /*** 配置通用action ***/
            'box-code_pack-pan component[doAction]': {click: self.doAction},
            'box-code_svn-win component[doAction]': {click: self.doAction},
            /*** 配置通用action-end ***/
            'box-code_pack-pan treepanel': {checkchange: self.changeTreeState},
        });

    },
    doAna: async function () {
        let mask = new Ext.LoadMask(Ext.ComponentQuery.query('box-code_pack-pan')[0], {
            msg: "正在获取目录树..."
        });
        mask.show();

        try {
            let projectPathCom = Ext.ComponentQuery.query('box-code_pack-pan textfield[name=projectPath]')[0];
            let projectPath = projectPathCom.getValue();
            projectPath = projectPath.replace(/\//g, '\\');
            if (projectPath.trim() == '') {
                ExtUtil.showTip('路径不能为空');
                return;
            }
            if (!/\\$/.test(projectPath)) {
                projectPath += '\\';
            }
            projectPathCom.setValue(projectPath);

            localStorage.setItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_PRO_PATH, projectPath);

            let ret = await ExtFileUtil.getTreeData(projectPath);

            let tree = Ext.ComponentQuery.query('box-code_pack-pan treepanel')[0];
            let store = tree.getStore();
            store.removeAll();
            store.setRoot({
                id: '',
                checked: false,
                expanded: true,
                children: []
            });
            let root = store.getRoot();
            root.appendChild(ret);

            let rootNode = tree.getRootNode();
            rootNode.expand();
            rootNode.expandChildren();


            // 加载上次操作的数据
            if (projectPath === localStorage.getItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_LAST_EXP_PATH)) {
                let lastIds = localStorage.getItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_IDS);
                if (typeof(lastIds) != 'undefined' && lastIds != null) {
                    // 恢复上次选择
                    lastIds = JSON.parse(lastIds);
                    for (let i = 0; i < lastIds.length; i++) {

                        let id = lastIds[i];
                        let ids = id.split('\\');
                        let temp = '';
                        let pNode = rootNode;

                        for (let j = 1; j < ids.length; j++) {

                            temp += '\\' + ids[j];
                            let record = store.getById(temp);
                            if (record != null) {
                                record.set('checked', true);
                                record.commit();
                                if (record.get('leaf') != true) {
                                    record.expand();
                                }

                            }

                        }

                    }

                }
            } else {
                localStorage.setItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_LAST_EXP_PATH, projectPath);
            }


        } catch (e) {
            console.error(e);
        } finally {
            mask.hide();
        }


    },
    changeTreeState: function (node, checked, eOpts) {
        ExtFileUtil.changeTreeState(node, checked, eOpts);
    },
    doExport: async function () {
        let mask = new Ext.LoadMask(Ext.ComponentQuery.query('box-code_pack-pan')[0], {
            msg: "正在导出..."
        });
        mask.show();

        try {
            let projectPathCom = Ext.ComponentQuery.query('box-code_pack-pan textfield[name=projectPath]')[0];
            let projectPath = projectPathCom.getValue();

            let outputPathCom = Ext.ComponentQuery.query('box-code_pack-pan textfield[name=outputPath]')[0];
            let outputPath = outputPathCom.getValue();
            if (outputPath.trim() === '') {
                ExtUtil.showTip('导出路径不允许为空');
                return;
            }

            outputPath = outputPath.replace(/\//g, '\\');
            if (!/\\$/.test(outputPath)) {
                outputPath += '\\';
            }
            outputPathCom.setValue(outputPath);

            localStorage.setItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_EXP_PATH, outputPath);

            let tree = Ext.ComponentQuery.query('box-code_pack-pan treepanel')[0]
            let nodeList = tree.getChecked();
            let idArray = [];
            let i;
            for (i = 0; i < nodeList.length; i++) {
                let id = nodeList[i].get('id');
                let leaf = nodeList[i].get('leaf');
                if (leaf == true) {
                    idArray[idArray.length] = id;
                    console.log(id);
                }

            }

            for (let i = 0; i < idArray.length; i++) {
                let path = idArray[i];

                let srcPath = projectPath + path.replace(/\//g, "\\").replace(/[\\/] $ /, "");
                srcPath = srcPath.replace(/\\\\/g, "\\");

                let tarPath = outputPath + path;
                tarPath = tarPath.replace(/\//g, "\\").replace(/[^\\]+$/, "").replace(/\\\\/g, "\\");

                // console.log(srcPath);
                // console.log(tarPath);
                FileUtil.mkdirsSync(tarPath, null);
                let flag = FileUtil.copyFile(srcPath, tarPath);
                if (!flag) console.log(src + ":不存在!");

            }

            // 保存本次操作ids
            localStorage.setItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_LAST_EXP_PATH, projectPath);
            localStorage.setItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_IDS, JSON.stringify(idArray));

            ExtUtil.showTip('导出完毕');


        } catch (e) {
            console.error(e);
        } finally {
            mask.hide();
        }

    },
    /**
     * TODO java项目
     * 1. 解析src，勾选classes相应的文件
     *   1. if(.class) 遍历查找classes中的匿名内部类 $*.class 并勾选
     * 2. 提供列表勾选功能，根据列表直接勾选目标文件，包括class
     * @returns {Promise.<void>}
     */
    doCheckBySvn: async function () {
        let win = Ext.ComponentQuery.query('box-code_svn-win')[0];

        let mask = new Ext.LoadMask(win, {
            msg: "loading..."
        });
        mask.show();
        try {
            let form = win.down('form').getForm();
            if (!form.isValid()) {
                ExtUtil.showTip('参数有误');
                return;
            }
            let projectPathCom = Ext.ComponentQuery.query('box-code_pack-pan textfield[name=projectPath]')[0];
            let projectPath = projectPathCom.getValue();
            projectPath = projectPath.replace(/\//g, '\\');


            let data = form.getValues();
            console.info(data);


            localStorage.setItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_PASSWORD, data.password);
            localStorage.setItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_USERNAME, data.username);
            localStorage.setItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_SRC, data.src);
            localStorage.setItem(Tool.box.code.controller.PackController.LOCAL_STORAGE_KEY_CLASSES, data.classes);

            let shell = "svn log " +
                data.url +
                " --username " +
                data.username +
                " --password " +
                data.password +
                " -r {" + data.from + "}:{" + data.to + "}" +
                " -v --xml > xml_log.xml";
            console.info('SHELL = ' + shell);
            let info = await ShellUtil.execute('svn_log.cmd', shell);
            let content = await FileUtil.readFileAsync('xml_log.xml', 'utf-8');
            let json = await FileUtil.xml2json(content);

            if (data.author.trim() == '') {
                data.author = null;
            }

            let msg_reg = null;
            if (data.msg.trim() == '') {
                data.msg = null;
            } else {
                msg_reg = new RegExp(data.msg, 'g');
            }

            if (json.log == null || json.log.logentry == null || json.log.logentry.length == 0) {
                ExtUtil.showTip('暂无数据');
                return;
            }


            let src_relative_url = null;
            let classes_relative_url = null;
            if (data.java == 'on') {
                let path = require('path');
                src_relative_url = path.normalize(data.relative_url + data.src).replace(/\\/g, '/');
                classes_relative_url = path.normalize(data.relative_url + data.classes).replace(/\\/g, '/');
                console.info('relative=' + data.relative_url)
                console.info('src=' + src_relative_url)
                console.info('classes=' + classes_relative_url)
            }

            let pathSet = new Set();
            json.log.logentry.forEach(function (logentry) {
                if (data.author != null) {
                    let find = false;
                    for (let i = 0; i < logentry.author.length; i++) {
                        if (logentry.author[i] == data.author) {
                            find = true;
                            break;
                        }
                    }
                    if (find == false) return;
                }
                if (data.msg != null) {
                    let find = false;
                    for (let i = 0; i < logentry.msg.length; i++) {
                        msg_reg.compile(data.msg, 'g');
                        if (msg_reg.test(logentry.msg[i])) {
                            find = true;
                            break;
                        }
                    }
                    if (find == false) return;
                }


                logentry.paths.forEach(function (pathentry) {
                    pathentry.path.forEach(function (path) {

                        if (path['_'].lastIndexOf('/') > path['_'].lastIndexOf('.')) {
                            // 文件/路径 判断
                            return;
                        }

                        if (path['_'].startsWith(data.relative_url)) {

                            let tmp_path = path['_'].replace(data.relative_url, '');
                            pathSet.add(tmp_path);

                        } else if (path['_'].startsWith(src_relative_url)) {
                            // src

                            // project相对路径
                            let classes_pro_path = path['_']
                                .replace(src_relative_url, classes_relative_url)
                                .replace(classes_relative_url, data.classes).replace(/.java$/g, '.class');

                            if (classes_pro_path.endsWith('.class')) {

                                let classes_real_path = projectPath + classes_pro_path;
                                let classes_file_name = classes_real_path.substr(classes_real_path.lastIndexOf('/') + 1);
                                classes_real_path = classes_real_path.substr(0, classes_real_path.lastIndexOf('/'));

                                let $classPrefix = classes_file_name.substr(0, classes_file_name.indexOf('.class')) + '$';

                                let files = FileUtil.listFilesSync(classes_real_path);
                                files.forEach(function (val) {

                                    if (val == classes_file_name) {
                                        let n = classes_pro_path.replace(classes_file_name, val);
                                        pathSet.add(n);
                                    } else if (val.startsWith($classPrefix)) {

                                        let $classs = classes_pro_path.substr(0, classes_pro_path.lastIndexOf('/')) + '/' + val;
                                        pathSet.add($classs);
                                    }
                                });

                            } else {
                                pathSet.add(classes_pro_path);
                            }
                        }


                    });

                })
            });
            if (pathSet.size == 0) {
                ExtUtil.showTip('暂无数据');
                return;
            }
            console.log(pathSet)


            let treepanel = Ext.ComponentQuery.query('box-code_pack-pan')[0].down('treepanel');
            let treeStore = treepanel.getStore();
            pathSet.forEach(function (val) {

                ExtFileUtil.expandFileTreeById(treeStore, val);
                let nodeRecord = treeStore.getById(val);
                if (nodeRecord == null) {
                    console.log("not found:" + val);
                    return;
                }
                ExtFileUtil.changeTreeState(nodeRecord, true);

            });

            win.close();

        } catch (e) {
            console.error(e);
            let msgs = e.message.split('\n');
            for (let i = msgs.length - 1; i >= 0; i--) {
                if (msgs[i].startsWith('svn: E730060') || msgs[i].startsWith('svn: E170001')) {
                    ExtUtil.showTip(msgs[i]);
                    return;
                }
            }
            ExtUtil.showTip(msgs.join('\n'));

        } finally {
            try {
                mask.hide();
            } catch (e) {
            }
        }


    }

});